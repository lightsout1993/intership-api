import { Model, Types } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import type IGenre from './genre.interface';
import { Genre } from './schemas/genre.schema';
import type { User } from '../user/schemas/user.schema';
import type { GenreCredentialsDto } from './dto/genre-credentials.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly GenreModel: Model<Genre>,
  ) {}

  async findAll(user: User): Promise<IGenre[]> {
    return await this.GenreModel.find({ user: user._id }).exec();
  }

  async create(user: User, genreCredentials: GenreCredentialsDto): Promise<IGenre> {
    const genre = new this.GenreModel({
      ...genreCredentials,
      user: user._id,
    });
    await genre.save();

    return genre;
  }

  async update(user: User, _id: string, genreCredentials: GenreCredentialsDto): Promise<IGenre> {
    const genre = await this.findGenreByName(user, genreCredentials.name);

    if (genre && genre.id !== _id) GenreService.throwBadRequestException();

    const { n: matchedCount } = await this.GenreModel.updateOne({ _id }, { $set: {} });

    if (matchedCount === 0) GenreService.throwNotFoundException();

    return this.GenreModel
      .findOne({ _id })
      .populate('avatar')
      .exec();
  }

  async deleteOne(_id: string): Promise<Types.ObjectId | never> {
    const genre = await this.GenreModel.findOne({ _id }).exec();

    if (!genre) GenreService.throwNotFoundException();

    await genre.remove();

    return Types.ObjectId(_id);
  }

  private async findGenreByName(user: User, name: string) {
    return await this.GenreModel.findOne({ name, user: user._id }).exec();
  }

  private static throwNotFoundException(): never {
    throw new NotFoundException('Couldn\'t find an genre with this id');
  }

  private static throwBadRequestException(): never {
    throw new BadRequestException('An genre with the same name already exists');
  }
}
