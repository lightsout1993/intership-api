import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import omit from 'lodash.omit';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import type { IPainting } from './painting.interface';
import type { Image } from '../image/schemas/image.schema';

import { ImageDto } from '../image/dto/image.dto';
import { Painting } from './schemas/painting.schema';
import { ImageService } from '../image/image.service';
import { Artist } from '../artist/schemas/artist.schema';
import { PaintingCredentialsDto } from './dto/painting-credentials.dto';
import { PartialPaintingCredentialsDto } from './dto/partial-painting-credentials.dto';

@Injectable()
export class PaintingService {
  constructor(
    private readonly imageService: ImageService,
    @InjectModel(Artist.name) private readonly ArtistModel: Model<Artist>,
    @InjectModel(Painting.name) private readonly PaintingModel: Model<Painting>,
  ) {}

  async findAll(artistId: string): Promise<IPainting[]> {
    const artist = await this.ArtistModel.findById(artistId)
      .populate({
        path: 'paintings',
        populate: { path: 'image', select: '-_id' },
      })
      .exec();

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
    artistId: string,
    paintingCredentials: PaintingCredentialsDto,
    image: ImageDto,
  ): Promise<IPainting | never> {
    await this.validateName(artistId, paintingCredentials.name);

    const paintingId = new Types.ObjectId();
    const imageId = new Types.ObjectId();

    await this.imageService.create(image, imageId);

    const painting = new this.PaintingModel({
      ...paintingCredentials,
      image: imageId,
      _id: paintingId,
      artist: new Types.ObjectId(artistId),
    });

    const artist = await this.ArtistModel.findById(artistId)
      .populate('paintings')
      .exec();

    if (!artist.paintings.length) {
      artist.mainPainting = painting._id;
    }

    await artist.updateOne({
      _id: artistId,
      $push: { paintings: painting._id },
    });

    await artist.save();
    await painting.populate('image', '-_id');

    return painting.save();
  }

  async update(
    artistId: string,
    _id: string,
    paintingCredentials: PartialPaintingCredentialsDto,
    image?: ImageDto,
  ): Promise<IPainting | never> {
    await this.validateName(artistId, paintingCredentials.name);

    const painting = await this.PaintingModel.findById(_id, {
      artist: false,
    })
      .populate('image')
      .exec();

    const imageObject: Record<string, string | Types.ObjectId> = {};

    if (image) {
      await this.imageService.remove(painting.image._id);
      const imageId = new Types.ObjectId();
      await this.imageService.create(image, imageId);
      imageObject.image = imageId;
    }

    const { n: matchedCount } = await painting
      .updateOne({
        $set: { ...paintingCredentials, ...imageObject },
      })
      .exec();

    if (matchedCount === 0) {
      throw new NotFoundException("Couldn't find an painting with this id");
    }

    await painting.populate('image', '-_id');

    return painting.save();
  }

  async deleteOne(_id: string): Promise<string | never> {
    const painting = await this.PaintingModel.findById(_id)
      .populate('image')
      .exec();

    if (!painting) {
      throw new NotFoundException("Couldn't find an painting with this id");
    }

    await this.imageService.remove(painting.image._id);
    await painting.deleteOne();

    return _id;
  }

  private async validateName(
    artistId: string,
    paintingName: string,
  ): Promise<void | never> {
    const artist = await this.ArtistModel.findById(artistId).exec();
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
