import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  ValidationPipe,
} from '@nestjs/common';
import type { Types } from 'mongoose';

import type IGenre from './genre.interface';
import { GenreService } from './genre.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import type { GenreCredentialsDto } from './dto/genre-credentials.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('static')
  async findAllStatic(): Promise<IGenre[]> {
    return await this.genreService.findAllStatic();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<IGenre[]> {
    return this.genreService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<IGenre | never> {
    return this.genreService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body(ValidationPipe) genreCredentials: GenreCredentialsDto,
  ): Promise<IGenre | never> {
    return this.genreService.create(genreCredentials);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) genreCredentials: GenreCredentialsDto,
  ): Promise<IGenre | never> {
    return this.genreService.update(id, genreCredentials);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<Types.ObjectId | never> {
    return await this.genreService.deleteOne(id);
  }
}
