import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Genre } from './schemas/genre.schema';
import { GenreCredentialsDto } from './dto/genre-credentials.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly GenreModel: Model<Genre>,
  ) {}

  async findAll() {
    return this.GenreModel.find().exec();
  }

  async findByName(name: string) {
    return this.GenreModel.findOne({ name }).exec();
  }

  async create(genreCredentials: GenreCredentialsDto) {
    const genre = new this.GenreModel(genreCredentials);

    return genre.save();
  }
}
