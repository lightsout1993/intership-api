import type { GenreCredentialsDto } from './dto/genre-credentials.dto';
import type IGenre from './genre.interface';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Genre } from './schemas/genre.schema';

@Injectable()
export class GenreService {
  constructor(@InjectModel(Genre.name) private readonly GenreModel: Model<Genre>) {}

  async findAllStatic(): Promise<IGenre[]> {
    return await this.GenreModel.find();
  }

  async findAll(): Promise<IGenre[]> {
    return await this.GenreModel.find().exec();
  }

  async findOne(id: string): Promise<IGenre> {
    return await this.GenreModel.findOne({ _id: id }).exec();
  }

  async create(genreCredentials: GenreCredentialsDto): Promise<IGenre> {
    const genre = await this.findGenreByName(genreCredentials.name);

    if (genre) throw GenreService.throwBadRequestException();

    const newGenre = new this.GenreModel({
      ...genreCredentials,
    });
    await newGenre.save();

    return newGenre;
  }

  async findGenresByIdsOrFail(ids: string[]): Promise<Genre[]> {
    try {
      const genres = await this.GenreModel.find({ _id: { $in: ids } }).exec();
      if (!genres || !genres.length || genres.length < ids.length) throw new Error();
      return genres;
    } catch (e) {
      return GenreService.throwNotFoundException();
    }
  }

  async update(_id: string, genreCredentials: GenreCredentialsDto): Promise<IGenre> {
    const genre = await this.findGenreByName(genreCredentials.name);

    if (genre && genre.id !== _id) GenreService.throwBadRequestException();

    const { n: matchedCount } = await this.GenreModel.updateOne({ _id }, { $set: {} });

    if (matchedCount === 0) GenreService.throwNotFoundException();

    return this.GenreModel.findOne({ _id }).populate('avatar').exec();
  }

  async deleteOne(_id: string): Promise<Types.ObjectId | never> {
    const genre = await this.GenreModel.findOne({ _id }).exec();

    if (!genre) GenreService.throwNotFoundException();

    await genre.remove();

    return Types.ObjectId(_id);
  }

  private async findGenreByName(name: string) {
    return await this.GenreModel.findOne({ name }).exec();
  }

  private static throwNotFoundException(): never {
    throw new NotFoundException("Couldn't find an genre with this id");
  }

  private static throwBadRequestException(): never {
    throw new BadRequestException('An genre with the same name already exists');
  }
}
