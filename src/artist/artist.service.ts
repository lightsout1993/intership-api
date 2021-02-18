import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import omit from 'lodash.omit';
import { DocumentQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Artist } from './schemas/artist.schema';
import type { IArtist, IArtistsResponse } from './artist.interface';
import type ImageDto from '../image/dto/image.dto';
import { ImageService } from '../image/image.service';
import type { User } from '../user/schemas/user.schema';
import type { Image } from '../image/schemas/image.schema';
import type { ArtistCredentialsDto } from './dto/artist-credentials.dto';

@Injectable()
export class ArtistService {
  constructor(
    private readonly imageService: ImageService,
    @InjectModel(Artist.name) private readonly ArtistModel: Model<Artist>,
  ) {}

  async findAll(user: User, perPage?: number, pageNumber?: number): Promise<IArtistsResponse> {
    const artists = this.ArtistModel.find(
      { user: user._id },
      { paintings: false, user: false },
    );

    const count: number = await artists.count().exec();

    const artistsPagination = ArtistService.pagination(artists, pageNumber, perPage);
    const data: IArtist[] = await artistsPagination.populate('avatar').exec();

    return { data, meta: { count, perPage, pageNumber } };
  }

  async findOne(_id: string): Promise<IArtist | never> {
    const artist = await this.ArtistModel
      .findOne({ _id }, { user: false })
      .populate('avatar')
      .populate('paintings', '-artist')
      .exec();

    if (!artist) ArtistService.throwNotFoundException();

    return artist;
  }

  async create(
    user: User,
    artistCredentials: ArtistCredentialsDto,
    avatar?: ImageDto,
  ): Promise<IArtist | never> {
    let artist = await this.findArtistByName(user, artistCredentials.name);

    if (artist) ArtistService.throwBadRequestException();

    const artistId = Types.ObjectId();

    const docArtist = {
      ...artistCredentials,
      _id: artistId,
      user: user._id,
    } as ArtistCredentialsDto & { _id: Types.ObjectId, avatar?: Image };

    if (avatar) {
      docArtist.avatar = await this.imageService.create(avatar, artistId.toHexString());
    }

    artist = new this.ArtistModel(docArtist);
    await artist.save();

    return omit(artist.toObject(), ['paintings', 'user']);
  }

  async update(
    user: User,
    _id: string,
    artistCredentials: Partial<ArtistCredentialsDto>,
    avatar?: ImageDto,
  ): Promise<IArtist | never> {
    const artist = await this.findArtistByName(user, artistCredentials.name);

    if (artist && artist.id !== _id) ArtistService.throwBadRequestException();

    const $set: Partial<ArtistCredentialsDto & { avatar: Image }> = artistCredentials;

    if (avatar) {
      await ImageService.remove(_id);
      $set.avatar = await this.imageService.create(avatar, _id);
    }

    const { n: matchedCount } = await this.ArtistModel.updateOne({ _id }, { $set });

    if (matchedCount === 0) ArtistService.throwNotFoundException();

    return this.ArtistModel
      .findOne({ _id }, { paintings: false, user: false })
      .populate('avatar')
      .exec();
  }

  async deleteOne(_id: string): Promise<Types.ObjectId | never> {
    const artist = await this.ArtistModel.findOne({ _id }).exec();

    if (!artist) ArtistService.throwNotFoundException();

    await artist.remove();
    await ImageService.remove(_id);

    return Types.ObjectId(_id);
  }

  private static pagination(
    artists: DocumentQuery<Artist[], Artist>,
    pageNumber: number,
    nPerPage: number,
  ): DocumentQuery<Artist[], Artist> {
    return pageNumber && nPerPage
      ? artists.skip((pageNumber - 1) * nPerPage).limit(nPerPage)
      : artists;
  }

  private async findArtistByName(user: User, name: string) {
    return await this.ArtistModel.findOne({ name, user: user._id }).exec();
  }

  private static throwNotFoundException(): never {
    throw new NotFoundException('Couldn\'t find an artist with this id');
  }

  private static throwBadRequestException(): never {
    throw new BadRequestException('An artist with the same name already exists');
  }
}
