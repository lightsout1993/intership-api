import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import omit from 'lodash.omit';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IPainting } from './painting.interface';
import { Painting } from './schemas/painting.schema';
import { Artist } from '../artist/schemas/artist.schema';
import { PaintingCredentialsDto } from './dto/painting-credentials.dto';

@Injectable()
export class PaintingService {
  constructor(
    @InjectModel(Artist.name) private readonly ArtistModel: Model<Artist>,
    @InjectModel(Painting.name) private readonly PaintingModel: Model<Painting>,
  ) {}

  async findAll(artistId: string): Promise<IPainting[]> {
    const { _id: artist } = await this.ArtistModel.findOne({ _id: artistId }).exec();
    return this.PaintingModel.find({ artist }, { artist: false });
  }

  async findOne(_id: string): Promise<IPainting | never> {
    const painting = await this.PaintingModel.findOne({ _id });

    if (!painting) PaintingService.throwNotFoundException();

    return omit(painting, 'artist');
  }

  async create(
    artistId: string,
    paintingCredentials: PaintingCredentialsDto,
  ): Promise<IPainting | never> {
    let painting = await this.findPaintingByName(artistId, paintingCredentials.name);

    if (painting) PaintingService.throwBadRequestException();

    painting = new this.PaintingModel({
      ...paintingCredentials,
      artist: Types.ObjectId(artistId),
      _id: Types.ObjectId(paintingCredentials.name),
    });

    await painting.save();

    await this.ArtistModel.updateOne({ _id: artistId }, { $push: { paintings: painting } });

    return omit(painting, 'artist');
  }

  async update(
    artistId: string,
    _id: string,
    authCredentialsDto: Partial<PaintingCredentialsDto>,
  ): Promise<IPainting | never> {
    const painting = await this.findPaintingByName(artistId, authCredentialsDto.name);

    if (painting && painting.id !== _id) PaintingService.throwBadRequestException();

    const { n: matchedCount } = await this.PaintingModel.updateOne(
      { _id },
      { $set: authCredentialsDto },
    );

    if (matchedCount === 0) PaintingService.throwNotFoundException();

    return this.PaintingModel.findOne({ _id }, { artist: false });
  }

  async deleteOne(_id: string): Promise<Types.ObjectId | never> {
    const { deletedCount } = await this.PaintingModel.deleteOne({ _id });

    if (deletedCount === 0) PaintingService.throwNotFoundException();

    return Types.ObjectId(_id);
  }

  private async findPaintingByName(artistId: string, name: string) {
    const { _id: artist } = await this.ArtistModel.findOne({ _id: artistId }).exec();
    return await this.PaintingModel.findOne({ artist, name }).exec();
  }

  private static throwNotFoundException(): never {
    throw new NotFoundException('Couldn\'t find an painting with this id');
  }

  private static throwBadRequestException(): never {
    throw new BadRequestException('An painting with the same name already exists');
  }
}
