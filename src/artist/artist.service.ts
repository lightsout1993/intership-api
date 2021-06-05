import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import omit from 'lodash.omit';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import type {
  IArtist,
  ArtistQuery,
  IArtistsResponse,
  IFiltersCredentials,
  ISortingCredentials,
  IPaginationCredentials,
  ArtistUpdateCredentials,
} from './artist.interface';
import { Artist } from './schemas/artist.schema';
import type ImageDto from '../image/dto/image.dto';
import { User } from '../user/schemas/user.schema';
import { ImageService } from '../image/image.service';
import { Genre } from '../genre/schemas/genre.schema';
import type { Image } from '../image/schemas/image.schema';
import { Painting } from '../painting/schemas/painting.schema';
import { PaintingService } from '../painting/painting.service';
import type { ArtistCredentialsDto } from './dto/artist-credentials.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly userService: UserService,
    private readonly imageService: ImageService,
    @InjectModel(Genre.name) private readonly GenreModel: Model<Genre>,
    @InjectModel(Artist.name) private readonly ArtistModel: Model<Artist>,
    @InjectModel(Painting.name) private readonly PaintingModel: Model<Painting>,
  ) {}

  async findAllStatic(): Promise<IArtist[]> {
    const demoUser = await this.userService.getDemoUser();

    return await this.ArtistModel
      .find(
        { user: demoUser },
        { avatar: false, paintings: false, user: false },
      )
      .exec();
  }

  async findAll(
    user: User,
    filters: IFiltersCredentials,
    sorting: ISortingCredentials,
    pagination: IPaginationCredentials,
  ): Promise<IArtistsResponse> {
    const artists = this.ArtistModel.find(
      { user: user._id },
      { paintings: false, user: false },
    );
    const artistSorting = ArtistService
      .sort(artists, sorting);

    const artistsPagination = ArtistService
      .paginate(artistSorting, pagination);

    const artistsFilteredByCountry = ArtistService
      .filterByCountry(artistsPagination, filters.country);

    const artistsFilteredByGenres = ArtistService
      .filterByGenres(artistsFilteredByCountry, filters.genres);

    const data: IArtist[] = await ArtistService.populate<Artist[]>(artistsFilteredByGenres).exec();

    return { data, meta: { count: data.length, ...pagination } };
  }

  async findOne(_id: string): Promise<Artist | never> {
    const artistQuery = await this.ArtistModel
      .findOne({ _id }, { user: false })

    const artist = await ArtistService.populate<Artist>(artistQuery).exec();

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

    return omit(artist.toObject(), ['paintings', 'user', 'mainPainting']);
  }

  async update(
    user: User,
    _id: string,
    artistCredentials: Partial<ArtistCredentialsDto>,
    avatar?: ImageDto,
  ): Promise<IArtist | never> {
    const artist = await this.findArtistByName(user, artistCredentials.name);

    if (artist && artist.id !== _id) ArtistService.throwBadRequestException();

    const $set: Partial<ArtistUpdateCredentials> = omit(artistCredentials, 'genres');

    if (avatar) {
      await ImageService.remove(_id);
      $set.avatar = await this.imageService.create(avatar, _id);
    }

    if (artistCredentials.genres.length) {
      $set.genres  = await this.GenreModel.find({ name: { $in: artistCredentials.genres } }).exec();
    }

    const { n: matchedCount } = await this.ArtistModel.updateOne({ _id }, { $set });

    if (matchedCount === 0) ArtistService.throwNotFoundException();

    return this.ArtistModel
      .findOne({ _id }, { paintings: false, user: false })
      .exec();
  }

  async deleteOne(_id: string): Promise<Types.ObjectId | never> {
    const artist = await this.ArtistModel.findOne({ _id }).exec();

    if (!artist) ArtistService.throwNotFoundException();

    await artist.remove();
    await ImageService.remove(_id);

    return Types.ObjectId(_id);
  }

  async appointMainPainting(artistId: string, _id: string): Promise<void | never> {
    const mainPainting = await this.PaintingModel.findOne({ _id }).exec();

    if (!mainPainting) PaintingService.throwNotFoundException();

    const { n: matchedCount } = await this.ArtistModel.updateOne({ mainPainting });

    if (matchedCount === 0) ArtistService.throwNotFoundException();
  }

  private static populate<T>(artistQuery): ArtistQuery<T> {
    return artistQuery
      .populate('avatar', '-artist')
      .populate('mainPainting', '-artist');
  }

  private static filterByGenres(
    artistsQuery: ArtistQuery<Artist[]>,
    genres: string[],
  ): ArtistQuery<Artist[]> {
    return genres.length
      ? artistsQuery.find({ genres: { $all: genres } })
      : artistsQuery;
  }

  private static filterByCountry(
    artistsQuery: ArtistQuery<Artist[]>,
    country: string,
  ): ArtistQuery<Artist[]> {
    return country
      ? artistsQuery.find({ country })
      : artistsQuery;
  }

  private static paginate(
    artistsQuery: ArtistQuery<Artist[]>,
    { pageNumber, perPage }: IPaginationCredentials,
  ): ArtistQuery<Artist[]> {
    return pageNumber && perPage
      ? artistsQuery.skip((pageNumber - 1) * perPage).limit(perPage)
      : artistsQuery;
  }

  private static sort(
    artists: ArtistQuery<Artist[]>,
    { sortBy, orderBy }: ISortingCredentials,
  ): ArtistQuery<Artist[]> {
    return sortBy && orderBy
      ? artists.sort({ [sortBy]: orderBy })
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
