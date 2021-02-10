import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Controller,
  ValidationPipe,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { IArtist } from './artist.interface';
import { ArtistService } from './artist.service';
import { ArtistCredentialsDto } from './dto/artist-credentials.dto';

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
  async create(
    @Body(ValidationPipe) artistCredentials: ArtistCredentialsDto,
  ): Promise<IArtist | never> {
    return this.artistService.create(artistCredentials);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IArtist | never> {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) artistCredentials: Partial<ArtistCredentialsDto>,
  ): Promise<IArtist | never> {
    return this.artistService.update(id, artistCredentials);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<Types.ObjectId | never> {
    return await this.artistService.deleteOne(id);
  }
}
