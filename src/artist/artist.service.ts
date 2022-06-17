import type ImageDto from '../image/dto/image.dto';
import type { Image } from '../image/schemas/image.schema';
import type {
  ArtistQuery,
  ArtistUpdateCredentials,
  IArtist,
  IArtistAggregateQuery,
  IArtistFilters,
  IArtistsResponse,
  IFiltersCredentials,
  IPaginationCredentials,
  ISortingCredentials,
} from './artist.interface';
import type { ArtistCredentialsDto } from './dto/artist-credentials.dto';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import omit from 'lodash.omit';
import { LeanDocument, Model, Types } from 'mongoose';
import { GenreService } from '../genre/genre.service';
import { Genre } from '../genre/schemas/genre.schema';
import { ImageService } from '../image/image.service';
import { PaintingService } from '../painting/painting.service';
import { Painting } from '../painting/schemas/painting.schema';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { Artist } from './schemas/artist.schema';

@Injectable()
export class ArtistService {
  constructor(
    private readonly userService: UserService,
    private readonly imageService: ImageService,
    private readonly genreService: GenreService,
    @InjectModel(Genre.name) private readonly GenreModel: Model<Genre>,
    @InjectModel(Artist.name) private readonly ArtistModel: Model<Artist>,
    @InjectModel(Painting.name) private readonly PaintingModel: Model<Painting>,
  ) {}

  async findAllStatic(): Promise<IArtist[]> {
    const demoUser = await this.userService.getDemoUser();

    return await this.ArtistModel.find(
      { user: demoUser._id },
      { avatar: false, paintings: false, user: false },
    )
      .populate({ path: 'mainPainting', populate: { path: 'image' } })
      .exec();
  }

  async findAll(
    user: User,
    filters: IFiltersCredentials,
    { sortBy, orderBy }: ISortingCredentials,
    pagination: IPaginationCredentials,
  ): Promise<IArtistsResponse> {
    const artistFilters: IArtistFilters = { user: user._id };

    if (filters.name) artistFilters.name = { $regex: filters.name, $options: 'i' };
    if (filters.genres.length) artistFilters.genres = { $all: filters.genres };

    const aggregateQuery: IArtistAggregateQuery[] = [
      { $match: artistFilters },
      { $project: { paintings: false, user: false } },
    ];

    if (sortBy && orderBy) aggregateQuery.push({ $sort: { [sortBy]: orderBy } });
    if (pagination.perPage && pagination.pageNumber)
      aggregateQuery.push(
        {
          $skip: (pagination.pageNumber - 1) * pagination.perPage,
        },
        { $limit: pagination.perPage },
      );

    const [
      {
        data,
        totalCount: [{ totalCount }],
      },
    ] = await this.ArtistModel.aggregate([
      {
        $facet: {
          data: aggregateQuery,
          totalCount: [{ $match: artistFilters }, { $count: 'totalCount' }],
        },
      },
    ]);

    return { data, meta: { count: totalCount, ...pagination } };
  }

  async findAllArtists(): Promise<IArtistsResponse> {
    const artistsQuery = this.ArtistModel.find({}, { paintings: false, user: false });

    const data: IArtist[] = await ArtistService.populate<Artist[]>(artistsQuery).exec();

    return { data, meta: { count: data.length } };
  }

  async findOne(_id: string): Promise<IArtist | never> {
    const artistQuery = this.ArtistModel.findOne({ _id }, { user: false });

    const artist = await ArtistService.populate<Artist>(artistQuery)
      .populate({ path: 'paintings', populate: { path: 'image' } })
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
    } as ArtistCredentialsDto & { _id: Types.ObjectId; avatar?: Image };

    if (avatar) {
      docArtist.avatar = await this.imageService.create(avatar, artistId.toHexString());
    }

    if (artistCredentials.genres.length) {
      await this.genreService.findGenresByIdsOrFail(artistCredentials.genres);
    }

    artist = new this.ArtistModel(docArtist);
    await artist.save();

    return omit(artist.toObject(), ['paintings', 'user', 'mainPainting']);
  }

  async registrationCreate(
    user: User,
    artistCredentials: Omit<LeanDocument<Artist>, 'user'>,
  ): Promise<void | never> {
    const artistId = Types.ObjectId();

    const docArtist = {
      ...artistCredentials,
      _id: artistId,
      user: user._id,
    } as LeanDocument<Artist> & { _id: Types.ObjectId };

    const artist = new this.ArtistModel(docArtist);
    await artist.save();
  }

  async update(
    user: User,
    _id: string,
    artistCredentials: Partial<ArtistCredentialsDto>,
    avatar?: ImageDto,
  ): Promise<IArtist | never> {
    const artist = await this.findArtistByName(user, artistCredentials.name);

    if (artist && artist.id !== _id) ArtistService.throwBadRequestException();

    const $set: Partial<ArtistUpdateCredentials> = omit(artistCredentials, ['genres', 'country']);
    const imageId = Types.ObjectId();

    if (avatar) {
      // await ImageService.remove(_id);
      // $set.avatar = await this.imageService.create(avatar, imageId.toHexString());
      const newImage = await this.imageService.create(avatar, imageId.toHexString());
      $set.avatar = newImage._id;
    
    }

    if (artistCredentials.genres?.length) {
      $set.genres = await this.genreService.findGenresByIdsOrFail(artistCredentials.genres);
    }

    const { n: matchedCount } = await this.ArtistModel.updateOne({ _id }, { $set });

    if (matchedCount === 0) ArtistService.throwNotFoundException();

    return this.ArtistModel.findOne({ _id }, { paintings: false, user: false }).exec();
  }

  async deleteOne(_id: string): Promise<Types.ObjectId | never> {
    const artist = await this.ArtistModel.findOne({ _id }).exec();

    if (!artist) ArtistService.throwNotFoundException();

    await artist.remove();
    // await ImageService.remove(_id);

    return Types.ObjectId(_id);
  }

  async appointMainPainting(artistId: string, _id: string): Promise<void | never> {
    const artist = await this.ArtistModel.findOne({ _id: artistId });
    const painting = await this.PaintingModel.findOne({ _id });

    if (!artist) ArtistService.throwNotFoundException();
    if (!painting) PaintingService.throwNotFoundException();

    const { n: matchedCount } = await this.ArtistModel.updateOne(
      { _id: artistId },
      {
        mainPainting: painting,
      },
    );

    if (matchedCount === 0) ArtistService.throwNotFoundException();
  }

  private static populate<T>(artistQuery: ArtistQuery<T>): ArtistQuery<T> {
    return artistQuery
      .populate('avatar')
      .populate({ path: 'mainPainting', populate: { path: 'image' } })
      .populate('genres');
  }

  private async findArtistByName(user: User, name: string) {
    return await this.ArtistModel.findOne({ name, user: user._id }).exec();
  }

  static throwNotFoundException(): never {
    throw new NotFoundException("Couldn't find an artist with this id");
  }

  private static throwBadRequestException(): never {
    throw new BadRequestException('An artist with the same name already exists');
  }
}
