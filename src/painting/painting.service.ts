import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ImageDto } from '@/image/dto/image.dto';
import { ImageService } from '@/image/image.service';
import { Artist } from '@/artist/schemas/artist.schema';

import type { IPainting } from './painting.interface';

import { Painting } from './schemas/painting.schema';
import { PaintingCredentialsDto } from './dto/painting-credentials.dto';
import { PartialPaintingCredentialsDto } from './dto/partial-painting-credentials.dto';

@Injectable()
export class PaintingService {
  constructor(
    private readonly imageService: ImageService,
    @InjectModel(Artist.name) private readonly ArtistModel: Model<Artist>,
    @InjectModel(Painting.name) private readonly PaintingModel: Model<Painting>,
  ) {}

  async findAll(artist: Artist): Promise<IPainting[]> {
    await artist.populate({
      path: 'paintings',
      populate: { path: 'image', select: '-_id' },
    });

    if (!artist) {
      throw new NotFoundException("Couldn't find an artist with this id");
    }

    return artist.paintings;
  }

  async findOne(_id: string): Promise<IPainting | never> {
    const painting = await this.PaintingModel.findById(_id, { artist: false })
      .populate('image', '-_id')
      .exec();

    if (!painting) {
      throw new NotFoundException("Couldn't find an painting with this id");
    }

    return painting;
  }

  async create(
    artist: Artist,
    paintingCredentials: PaintingCredentialsDto,
    image: ImageDto,
  ): Promise<IPainting | never> {
    await this.validateName(artist, paintingCredentials.name);

    const paintingId = new Types.ObjectId();
    const imageId = new Types.ObjectId();

    await this.imageService.create(image, imageId);

    const painting = new this.PaintingModel({
      ...paintingCredentials,
      image: imageId,
      _id: paintingId,
      artist: artist._id,
    });

    await artist.updateOne({
      $push: { paintings: painting._id },
      $set: artist.paintings.length ? {} : { mainPainting: painting._id },
    });

    await artist.save();
    await painting.populate('image', '-_id');

    return painting.save();
  }

  async update(
    artist: Artist,
    _id: string,
    paintingCredentials: PartialPaintingCredentialsDto,
    image?: ImageDto,
  ): Promise<IPainting | never> {
    await this.validateName(artist, paintingCredentials.name);

    const painting = artist.paintings.find(
      (painting) => painting._id.toString() === _id,
    );

    if (!painting) {
      throw new NotFoundException("Couldn't find an painting with this id");
    }

    await painting.populate('image');

    if (image) {
      await this.imageService.remove(painting.image._id);
      const { _id } = await this.imageService.create(
        image,
        new Types.ObjectId(),
      );

      await painting.updateOne({ $set: { image: _id } });
    }

    await painting.updateOne({ $set: paintingCredentials }).exec();
    await painting.populate('image', '-_id');

    return painting.save();
  }

  async deleteOne(artist: Artist, _id: string): Promise<string | never> {
    await artist.populate('paintings');
    const painting = artist.paintings.find(({ _id: id }) => id === _id);

    if (!painting) {
      throw new NotFoundException("Couldn't find an painting with this id");
    }

    await painting.populate('image');
    await this.imageService.remove(painting.image._id);
    await painting.deleteOne();

    return _id;
  }

  private async validateName(
    artist: Artist,
    paintingName: string,
  ): Promise<void | never> {
    await artist.populate('paintings');

    const findIndex = artist.paintings.findIndex(
      ({ name }) => name === paintingName,
    );

    if (findIndex >= 0) {
      throw new BadRequestException(
        'An painting with the same name already exists',
      );
    }
  }
}
