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
import omit from 'lodash.omit';
import { FileInterceptor } from '@nestjs/platform-express';

import type { User as UserModel } from '@/user/schemas/user.schema';

import { ImageDto } from '@/image/dto/image.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { User } from '@/internal/decorators/user.decorator';

import { ArtistService } from './artist.service';
import { ArtistCredentialsDto } from './dto/artist-credentials.dto';
import { PartialArtistCredentialsDto } from './dto/partial-artist-credentials.dto';

@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get('/static')
  async findAllStatic(
    @Query('sortBy') sortBy?: 'name',
    @Query('country') country?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
    @Query('perPage', new DefaultValuePipe(0), ParseIntPipe) perPage?: number,
    @Query('genres', new DefaultValuePipe([]), ParseArrayPipe)
    genres?: string[],
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe)
    pageNumber?: number,
  ) {
    const params = {
      genres,
      sortBy,
      country,
      orderBy,
      perPage,
      pageNumber,
    };

    return this.artistService.findAllStatic(params);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @User() user?: UserModel,
    @Query('sortBy') sortBy?: 'name',
    @Query('country') country?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
    @Query('perPage', new DefaultValuePipe(0), ParseIntPipe) perPage?: number,
    @Query('genres', new DefaultValuePipe([]), ParseArrayPipe)
    genres?: string[],
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe)
    pageNumber?: number,
  ) {
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
  ) {
    const artist = await this.artistService.create(
      user,
      artistCredentials,
      avatar,
    );

    return omit(artist.toObject(), 'user');
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@User() user: UserModel, @Param('id') id: string) {
    return await this.artistService.findOne(user, id);
  }

  @Get(':id/static')
  async findOneStatic(@Param('id') id: string) {
    console.log(await this.artistService.findOneStatic(id));
    return await this.artistService.findOneStatic(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @User() user: UserModel,
    @Param('id') id: string,
    @Body(ValidationPipe) artistCredentials: PartialArtistCredentialsDto,
    @UploadedFile(ValidationPipe) avatar?: ImageDto,
  ) {
    return this.artistService.update(user, id, artistCredentials, avatar);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@User() user: UserModel, @Param('id') id: string) {
    return this.artistService.deleteOne(user, id);
  }

  @Patch(':id/main-painting')
  @UseGuards(JwtAuthGuard)
  async appointMainPainting(
    @User() user: UserModel,
    @Param('id') id: string,
    @Body(ValidationPipe) artistCredentials: PartialArtistCredentialsDto,
  ) {
    return this.artistService.appointMainPainting(
      user,
      id,
      artistCredentials.mainPainting,
    );
  }
}
