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
import type { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

import type {
  IArtist,
  IArtistsResponse,
  IFiltersCredentials,
  ISortingCredentials,
  IPaginationCredentials,
} from './artist.interface';
import { ArtistService } from './artist.service';
import type ImageDto from '../image/dto/image.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from '../internal/decorators/user.decorator';
import type { User as UserModel } from '../user/schemas/user.schema';
import type { ArtistCredentialsDto } from './dto/artist-credentials.dto';

@Controller('artists')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
  ) {}

  @Get('static')
  async findAllStatic(): Promise<IArtist[]> {
    return await this.artistService.findAllStatic();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @User() user: UserModel,
    @Query('sortBy') sortBy?: 'name',
    @Query('country') country?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
    @Query('perPage', new DefaultValuePipe(0), ParseIntPipe) perPage?: number,
    @Query('genres', new DefaultValuePipe([]), ParseArrayPipe) genres?: string[],
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe) pageNumber?: number,
  ): Promise<IArtistsResponse> {
    const filters: IFiltersCredentials = { genres, country };
    const sorting: ISortingCredentials = { sortBy, orderBy };
    const pagination: IPaginationCredentials = { perPage, pageNumber };

    return this.artistService.findAll(user, filters, sorting, pagination);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @User() user: UserModel,
    @Body(ValidationPipe) artistCredentials: ArtistCredentialsDto,
    @UploadedFile() avatar?: ImageDto,
  ): Promise<IArtist | never> {
    return this.artistService.create(user, artistCredentials, avatar);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<IArtist | never> {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @User() user: UserModel,
    @Param('id') id: string,
    @Body(ValidationPipe) artistCredentials: Partial<ArtistCredentialsDto>,
    @UploadedFile() avatar?: ImageDto,
  ): Promise<IArtist | never> {
    return this.artistService.update(user, id, artistCredentials, avatar);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
  ): Promise<Types.ObjectId | never> {
    return await this.artistService.deleteOne(id);
  }

  @Patch(':id/main-painting')
  @UseGuards(JwtAuthGuard)
  async appointMainPainting(
    @Param('id') id: string,
    @Body(ValidationPipe) artistCredentials: Partial<ArtistCredentialsDto>,
  ): Promise<void | never> {
    return await this.artistService.appointMainPainting(id, artistCredentials.mainPainting);
  }
}
