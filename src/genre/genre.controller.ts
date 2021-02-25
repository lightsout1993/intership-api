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
import { User } from '../internal/decorators/user.decorator';
import type { User as UserModel } from '../user/schemas/user.schema';
import type { GenreCredentialsDto } from './dto/genre-credentials.dto';

@Controller('genres')
export class GenreController {
  constructor(
    private readonly genreService: GenreService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @User() user: UserModel,
  ): Promise<IGenre[]> {
    return this.genreService.findAll(user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @User() user: UserModel,
    @Body(ValidationPipe) genreCredentials: GenreCredentialsDto,
  ): Promise<IGenre | never> {
    return this.genreService.create(user, genreCredentials);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @User() user: UserModel,
    @Param('id') id: string,
    @Body(ValidationPipe) genreCredentials: GenreCredentialsDto,
  ): Promise<IGenre | never> {
    return this.genreService.update(user, id, genreCredentials);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
  ): Promise<Types.ObjectId | never> {
    return await this.genreService.deleteOne(id);
  }
}
