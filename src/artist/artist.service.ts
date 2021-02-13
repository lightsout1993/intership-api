import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import omit from 'lodash.omit';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { IArtist } from './artist.interface';
import { Artist } from './schemas/artist.schema';
import type { ArtistCredentialsDto } from './dto/artist-credentials.dto';

@Injectable()
export class ArtistService {
  constructor(@InjectModel(Artist.name) private readonly ArtistModel: Model<Artist>) {
  }

  async findAll(): Promise<IArtist[]> {
    return this.ArtistModel.find(null, { paintings: false });
  }

  async findOne(_id: string): Promise<IArtist | never> {
    const artist = await this.ArtistModel.findOne({ _id });

    if (!artist) ArtistService.throwNotFoundException();

    return artist;
  }

  async create(
    artistCredentials: ArtistCredentialsDto,
  ): Promise<IArtist | never> {
    let artist = await this.findArtistByName(artistCredentials.name);

    if (artist) ArtistService.throwBadRequestException();

    artist = new this.ArtistModel(artistCredentials);
    await artist.save();

    return omit(artist, 'paintings');
  }

  async update(
    _id: string,
    artistCredentials: Partial<IArtist>,
  ): Promise<IArtist | never> {
    const artist = await this.findArtistByName(artistCredentials.name);

    if (artist && artist.id !== _id) ArtistService.throwBadRequestException();

    const { n: matchedCount } = await this.ArtistModel.updateOne(
      { _id },
      { $set: artistCredentials },
    );

    if (matchedCount === 0) ArtistService.throwNotFoundException();

    return this.ArtistModel.findOne({ _id }, { paintings: false });
  }

  async deleteOne(_id: string): Promise<Types.ObjectId | never> {
    const { deletedCount } = await this.ArtistModel.deleteOne({ _id });

    if (deletedCount === 0) ArtistService.throwNotFoundException();

    return Types.ObjectId(_id);
  }

  private async findArtistByName(name) {
    return await this.ArtistModel.findOne({ name }).exec();
  }

  private static throwNotFoundException(): never {
    throw new NotFoundException('Couldn\'t find an artist with this id');
  }

  private static throwBadRequestException(): never {
    throw new BadRequestException('An artist with the same name already exists');
  }
}
