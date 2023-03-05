import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import type IGenre from './genre.interface';

import { Genre } from './schemas/genre.schema';
import { GenreCredentialsDto } from './dto/genre-credentials.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly GenreModel: Model<Genre>,
  ) {}

  async findAll(): Promise<IGenre[]> {
    return this.GenreModel.find().exec();
  }

  async create(genreCredentials: GenreCredentialsDto): Promise<IGenre> {
    const genre = new this.GenreModel(genreCredentials);

    return genre.save();
  }
}
