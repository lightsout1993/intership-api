import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Controller,
  UploadedFile,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import type { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

import { ArtistService } from './artist.service';
import type { IArtist } from './artist.interface';
import type ImageDto from '../image/dto/image.dto';
import type { ArtistCredentialsDto } from './dto/artist-credentials.dto';

@Controller('artists')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
  ) {}

  @Get()
  async findAll(): Promise<IArtist[]> {
    return this.artistService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body(ValidationPipe) artistCredentials: ArtistCredentialsDto,
    @UploadedFile() avatar?: ImageDto,
  ): Promise<IArtist | never> {
    return this.artistService.create(artistCredentials, avatar);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IArtist | never> {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) artistCredentials: Partial<ArtistCredentialsDto>,
    @UploadedFile() avatar?: ImageDto,
  ): Promise<IArtist | never> {
    return this.artistService.update(id, artistCredentials, avatar);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<Types.ObjectId | never> {
    return await this.artistService.deleteOne(id);
  }
}
