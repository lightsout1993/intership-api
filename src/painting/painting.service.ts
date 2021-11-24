import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import omit from 'lodash.omit';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import type ImageDto from '../image/dto/image.dto';
import { Painting } from './schemas/painting.schema';
import type { IPainting } from './painting.interface';
import { ImageService } from '../image/image.service';
import { Artist } from '../artist/schemas/artist.schema';
import type { Image } from '../image/schemas/image.schema';
import type { PaintingCredentialsDto } from './dto/painting-credentials.dto';

@Injectable()
export class PaintingService {
  constructor(
    private readonly imageService: ImageService,
    @InjectModel(Artist.name) private readonly ArtistModel: Model<Artist>,
    @InjectModel(Painting.name) private readonly PaintingModel: Model<Painting>,
  ) {}

  async create(
    artistId: string,
    paintingCredentials: PaintingCredentialsDto,
    image: ImageDto,
  ): Promise<IPainting | never> {
    let painting = await this.findPaintingByName(artistId, paintingCredentials.name);

    if (painting) PaintingService.throwBadRequestException();

    const paintingId = Types.ObjectId();

    const imageModel: Image = await this.imageService.create(image, paintingId.toHexString());

    painting = new this.PaintingModel({
      ...paintingCredentials,
      _id: paintingId,
      image: imageModel,
      artist: Types.ObjectId(artistId),
    });

    await painting.save();

    const artist = await this.ArtistModel.findOne({ _id: artistId }).exec();

    if (artist.paintings.length) {
      artist.mainPainting = painting;
    }

    await this.ArtistModel.updateOne({ _id: artistId }, { $push: { paintings: painting } });
    await artist.save();

    return omit(painting.toObject(), 'artist');
  }

  async findAll(artistId: string): Promise<IPainting[]> {
    const { _id: artist } = await this.ArtistModel.findOne({ _id: artistId }).exec();

    return this.PaintingModel.find({ artist }, { artist: false }).populate('image').exec();
  }

  async findOne(_id: string): Promise<IPainting | never> {
    const painting = await this.PaintingModel.findOne({ _id }, { artist: false })
      .populate('image')
      .exec();

    if (!painting) PaintingService.throwNotFoundException();

    return painting;
  }

  async update(
    artistId: string,
    _id: string,
    paintingCredentials: Partial<PaintingCredentialsDto>,
    image?: ImageDto,
  ): Promise<IPainting | never> {
    const painting = await this.findPaintingByName(artistId, paintingCredentials.name);

    if (painting && painting.id !== _id) PaintingService.throwBadRequestException();

    const $set: Partial<PaintingCredentialsDto & { image: Image }> = paintingCredentials;

    if (image) {
      await ImageService.remove(_id);
      const newImage = await this.imageService.create(image, _id);
      $set.image = newImage._id;
    }

    const { n: matchedCount } = await this.PaintingModel.updateOne({ _id }, { $set });

    if (matchedCount === 0) PaintingService.throwNotFoundException();

    return this.PaintingModel.findOne({ _id }, { artist: false }).populate('image');
  }

  async deleteOne(_id: string): Promise<Types.ObjectId | never> {
    const painting = await this.PaintingModel.findOne({ _id }).exec();

    if (!painting) PaintingService.throwNotFoundException();

    await painting.remove();
    await ImageService.remove(_id);

    return Types.ObjectId(_id);
  }

  private async findPaintingByName(artistId: string, name: string) {
    const { _id: artist } = await this.ArtistModel.findOne({ _id: artistId }).exec();
    return await this.PaintingModel.findOne({ artist, name }).exec();
  }

  static throwNotFoundException(): never {
    throw new NotFoundException("Couldn't find an painting with this id");
  }

  private static throwBadRequestException(): never {
    throw new BadRequestException('An painting with the same name already exists');
  }
}
