import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import omit from 'lodash.omit';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import type { Image } from '@/image/schemas/image.schema';
import type { ArtistCredentialsDto } from './dto/artist-credentials.dto';

import { ImageDto } from '@/image/dto/image.dto';
import { UserService } from '@/user/user.service';
import { User } from '@/user/schemas/user.schema';
import { Genre } from '@/genre/schemas/genre.schema';
import { GenreService } from '@/genre/genre.service';
import { ImageService } from '@/image/image.service';
import { Painting } from '@/painting/schemas/painting.schema';

import { Artist } from './schemas/artist.schema';
import { IFindAllParams } from './artist.interface';
import { PartialArtistCredentialsDto } from './dto/partial-artist-credentials.dto';

@Injectable()
export class ArtistService {
  constructor(
    private readonly userService: UserService,
    private readonly genreService: GenreService,
    private readonly imageService: ImageService,
    @InjectModel(Genre.name) private readonly GenreModel: Model<Genre>,
    @InjectModel(Artist.name) private readonly ArtistModel: Model<Artist>,
    @InjectModel(Painting.name) private readonly PaintingModel: Model<Painting>,
  ) {}

  async findAllStatic(params: Omit<IFindAllParams, 'user'>) {
    const user = await this.userService.getDemoUser();

    return this.findAll({ ...params, user });
  }

  async findAll({
    user,
    sortBy,
    genres,
    country,
    orderBy,
    count,
    offset,
  }: IFindAllParams) {
    let artists = this.ArtistModel.find(
      { user: user._id },
      { avatar: false, paintings: false, user: false },
    ).populate({
      path: 'mainPainting',
      populate: { path: 'image', select: '-_id -nonRemovable' },
    });

    const allCount = await artists.clone().countDocuments();

    if (offset || offset === 0) artists = artists.skip(offset);
    if (count || count === 0) artists = artists.limit(count);
    if (country) artists = artists.where('country').equals(country);
    if (genres.length) artists = artists.where('genres').all(genres);
    if (sortBy && orderBy) artists = artists.sort({ [sortBy]: orderBy });

    const data = await artists.exec();

    return { data, allCount };
  }

  async findOneStatic(id: string) {
    const user = await this.userService.getDemoUser();

    return this.findById(user, id);
  }

  async findOne(user: User, _id: string): Promise<Artist | never> {
    const artist = await this.findById(user, _id, {
      user: false,
      paintings: false,
      mainPainting: false,
    });

    await artist.populate('avatar', '-_id -nonRemovable');

    artist.genres = await this.GenreModel.find({
      _id: { $in: artist.genres },
    });

    return artist;
  }

  async create(
    user: User,
    artistCredentials: ArtistCredentialsDto,
    avatar?: Partial<ImageDto>,
  ): Promise<Artist> {
    await this.validateName(user, artistCredentials.name);

    const genres = await Promise.all(
      artistCredentials.genres?.map((genre) =>
        this.genreService.findByName(genre),
      ) || [],
    );

    const newArtist = {
      user: user._id,
      ...artistCredentials,
      genres,
    } as unknown as ArtistCredentialsDto & { avatar?: Image['_id'] };

    if (avatar) {
      const avatarId = new Types.ObjectId();
      await this.imageService.create(avatar, avatarId, 'avatar');
      newArtist.avatar = avatarId;
    }

    const artist = new this.ArtistModel(newArtist);
    await artist.populate({ path: 'avatar', select: '-_id -nonRemovable' });
    await artist.populate({
      path: 'mainPainting',
      select: '-_id -nonRemovable',
    });
    await artist.save();

    return artist;
  }

  async update(
    user: User,
    _id: string,
    artistCredentials: PartialArtistCredentialsDto,
    avatar?: ImageDto,
  ) {
    await this.validateName(user, artistCredentials.name, _id);

    const artist = await this.findById(user, _id);
    await artist.populate('avatar');

    if (artist.avatar && avatar) {
      await this.imageService.remove(artist.avatar._id as string);
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
      .populate({ path: 'avatar', select: '-_id -nonRemovable' })
      .exec();
  }

  async deleteOne(user: User, id: string) {
    const artist = await this.findById(user, id);
    await artist.populate('avatar');

    await this.imageService.remove(artist.avatar._id as string);
    await artist.deleteOne();

    return new Types.ObjectId(id);
  }

  async appointMainPainting(
    user: User,
    artistId: string,
    id: string,
  ): Promise<Artist> {
    const artist = await this.findById(user, id);
    await artist.populate('mainPainting', '-_id -nonRemovable');

    if (!artist) {
      throw new NotFoundException("Couldn't find an artist with this id");
    }

    if (artist.mainPainting?._id?.toString() === id) {
      throw new BadRequestException('This picture is already the main');
    }

    const painting = await this.PaintingModel.findById(id)
      .populate('image', '-_id -nonRemovable')
      .exec();

    if (!painting) {
      throw new NotFoundException("Couldn't find an painting with this id");
    }

    artist.mainPainting = painting;

    await artist.populate({
      path: 'mainPainting',
      populate: { path: 'image', select: '-_id -nonRemovable' },
    });
    await artist.save();

    return omit(artist.toObject(), ['avatar', 'genres', 'paintings', 'user']);
  }

  async findById(
    { _id: user }: User,
    _id: string,
    projection = {},
  ): Promise<Artist> {
    const artist = await this.ArtistModel.findOne({ _id, user }, projection);

    if (!artist) {
      throw new NotFoundException("Couldn't find an artist with this id");
    }

    return artist;
  }

  private async validateName({ _id: user }: User, name: string, id?: string) {
    const artist = await this.ArtistModel.exists({ name, user });

    if (artist && artist._id.toString() !== id) {
      throw new BadRequestException(
        'An artist with the same name already exists',
      );
    }
  }
}
