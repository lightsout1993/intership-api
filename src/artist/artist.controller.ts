import type { Types } from 'mongoose';

import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  UseGuards,
  Controller,
  ParseIntPipe,
  UploadedFile,
  ParseArrayPipe,
  ValidationPipe,
  UseInterceptors,
  DefaultValuePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import type { IArtist, IArtistsResponse } from './artist.interface';
import type { User as UserModel } from '../user/schemas/user.schema';

import { ArtistService } from './artist.service';
import { ImageDto } from '../image/dto/image.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from '../internal/decorators/user.decorator';
import { ArtistCredentialsDto } from './dto/artist-credentials.dto';
import { PartialArtistCredentialsDto } from './dto/partial-artist-credentials.dto';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async findAll(
    @User() user: UserModel,
    @Query('sortBy') sortBy?: 'name',
    @Query('country') country?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
    @Query('perPage', new DefaultValuePipe(0), ParseIntPipe) perPage?: number,
    @Query('genres', new DefaultValuePipe([]), ParseArrayPipe)
    genres?: string[],
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe)
    pageNumber?: number,
  ): Promise<IArtistsResponse> {
    const params = {
      user,
      genres,
      sortBy,
      country,
      orderBy,
      perPage,
      pageNumber,
    };

    return this.artistService.findAll(params);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @User() user: UserModel,
    @Body(ValidationPipe) artistCredentials: ArtistCredentialsDto,
    @UploadedFile(ValidationPipe) avatar?: ImageDto,
  ): Promise<IArtist | never> {
    return this.artistService.create(user, artistCredentials, avatar);
  }

  @Get(':id')
  async findOne(
    @User() user: UserModel,
    @Param('id') id: string,
  ): Promise<IArtist | never> {
    return this.artistService.findOne(user, id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @User() user: UserModel,
    @Param('id') id: string,
    @Body(ValidationPipe) artistCredentials: PartialArtistCredentialsDto,
    @UploadedFile(ValidationPipe) avatar?: ImageDto,
  ): Promise<IArtist | never> {
    return this.artistService.update(user, id, artistCredentials, avatar);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @User() user: UserModel,
    @Param('id') id: string,
  ): Promise<Types.ObjectId | never> {
    return this.artistService.deleteOne(user, id);
  }

  @Patch(':id/main-painting')
  @UseGuards(JwtAuthGuard)
  async appointMainPainting(
    @User() user: UserModel,
    @Param('id') id: string,
    @Body(ValidationPipe) artistCredentials: PartialArtistCredentialsDto,
  ): Promise<IArtist | never> {
    return this.artistService.appointMainPainting(
      user,
      id,
      artistCredentials.mainPainting,
    );
  }
}
