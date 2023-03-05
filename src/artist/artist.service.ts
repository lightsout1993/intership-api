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
  IFindAllParams,
  IArtistsResponse,
  Meta,
} from './artist.interface';
import type { Image } from '../image/schemas/image.schema';
import type { ArtistCredentialsDto } from './dto/artist-credentials.dto';

import { Artist } from './schemas/artist.schema';
import { ImageDto } from '../image/dto/image.dto';
import { User } from '../user/schemas/user.schema';
import { ImageService } from '../image/image.service';
import { Genre } from '../genre/schemas/genre.schema';
import { Painting } from '../painting/schemas/painting.schema';
import { PartialArtistCredentialsDto } from './dto/partial-artist-credentials.dto';

@Injectable()
export class ArtistService {
  constructor(
    private readonly imageService: ImageService,
    @InjectModel(Genre.name) private readonly GenreModel: Model<Genre>,
    @InjectModel(Artist.name) private readonly ArtistModel: Model<Artist>,
    @InjectModel(Painting.name) private readonly PaintingModel: Model<Painting>,
  ) {}

  async findAll({
    user,
    sortBy,
    genres,
    country,
    orderBy,
    perPage,
    pageNumber,
  }: IFindAllParams): Promise<IArtistsResponse> {
    let artists = this.ArtistModel.find(
      { user: user._id },
      { genres: false, paintings: false, user: false },
    ).populate({
      path: 'mainPainting',
      populate: { path: 'image', select: '-_id' },
    });

    let meta = {} as Meta;

    if (sortBy && orderBy) {
      artists = artists.sort({ [sortBy]: orderBy });
    }

    if (pageNumber && perPage) {
      artists = artists.skip((pageNumber - 1) * perPage).limit(perPage);
      meta = { pageNumber, perPage } as Meta;
    }

    if (country) {
      artists = artists.find({ country });
    }

    if (genres.length) {
      artists = artists.find({ genres: { $all: genres } });
    }

    const data: IArtist[] = await artists.exec();

    if (data.length) {
      meta.count = data.length;
    }

    return { data, meta };
  }

  async findOne(user: User, _id: string): Promise<Artist | never> {
    const artist = await this.ArtistModel.findOne(
      { _id, user: user._id },
      {
        user: false,
        paintings: false,
        mainPainting: false,
      },
    )
      .populate('genres')
      .populate('avatar', '-_id')
      .exec();

    if (!artist) {
      throw new NotFoundException("Couldn't find an artist with this id");
    }

    return artist;
  }

  async create(
    user: User,
    artistCredentials: ArtistCredentialsDto,
    avatar?: ImageDto,
  ): Promise<IArtist | never> {
    await this.validateName(user, artistCredentials.name);

    const newArtist = {
      user: user._id,
      ...artistCredentials,
    } as ArtistCredentialsDto & { avatar?: Image['_id'] };

    if (avatar) {
      const avatarId = new Types.ObjectId();
      await this.imageService.create(avatar, avatarId);
      newArtist.avatar = avatarId;
    }

    const artist = new this.ArtistModel(newArtist);
    await artist.populate({ path: 'avatar', select: '-_id' });
    await artist.populate({ path: 'mainPainting', select: '-_id' });
    await artist.save();

    return omit(artist.toObject(), 'user');
  }

  async update(
    user: User,
    _id: string,
    artistCredentials: PartialArtistCredentialsDto,
    avatar?: ImageDto,
  ): Promise<IArtist | never> {
    await this.validateName(user, artistCredentials.name, _id);
    const artistExists = await this.ArtistModel.exists({ _id });

    if (!artistExists?._id) {
      throw new NotFoundException("Couldn't find an artist with this id");
    }

    const artist = await this.ArtistModel.findOne({ _id, user: user._id })
      .populate('avatar')
      .exec();

    if (artist.avatar && avatar) {
      await this.imageService.remove(artist.avatar._id);
    }

    const $set = omit(artistCredentials, 'avatar', 'genres');

    if (avatar) {
      const avatarId = new Types.ObjectId();
      await this.imageService.create(avatar, avatarId, 'avatar');
      $set.avatar = avatarId;
    }

    if (artistCredentials.genres?.length) {
      $set.genres = artistCredentials.genres;
    }

    await artist.updateOne({ $set });

    return this.ArtistModel.findById(_id, {
      user: false,
      paintings: false,
      mainPainting: false,
    })
      .populate({ path: 'genres' })
      .populate({ path: 'avatar', select: '-_id' })
      .exec();
  }

  async deleteOne(user: User, _id: string): Promise<Types.ObjectId | never> {
    const artist = await this.ArtistModel.findOne({ _id, user: user._id })
      .populate('avatar')
      .exec();

    if (!artist) {
      throw new NotFoundException("Couldn't find an artist with this id");
    }

    await this.imageService.remove(artist.avatar._id);
    await artist.deleteOne();

    return new Types.ObjectId(_id);
  }

  async appointMainPainting(
    user: User,
    artistId: string,
    _id: string,
  ): Promise<IArtist | never> {
    const artist = await this.ArtistModel.findOne({
      _id: artistId,
      user: user._id,
    })
      .populate('mainPainting')
      .exec();

    if (!artist) {
      throw new NotFoundException("Couldn't find an artist with this id");
    }

    if (artist.mainPainting?._id?.toString() === _id) {
      throw new BadRequestException('This picture is already the main');
    }

    const painting = await this.PaintingModel.findById(_id)
      .populate('image', '-_id')
      .exec();

    if (!painting) {
      throw new NotFoundException("Couldn't find an painting with this id");
    }

    artist.mainPainting = painting._id;
    await artist.populate({
      path: 'mainPainting',
      populate: { path: 'image', select: '-_id' },
    });
    await artist.save();

    return omit(artist.toObject(), ['avatar', 'genres', 'paintings', 'user']);
  }

  private async validateName(
    { _id: user }: User,
    name: string,
    id?: string,
  ): Promise<void | never> {
    const artist = await this.ArtistModel.exists({ name, user });

    if (artist && artist._id.toString() !== id) {
      throw new BadRequestException(
        'An artist with the same name already exists',
      );
    }
  }
}
