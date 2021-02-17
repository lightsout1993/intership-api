import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Controller,
  ValidationPipe, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { IPainting } from './painting.interface';
import { PaintingService } from './painting.service';
import { ArtistCredentialsDto } from '../artist/dto/artist-credentials.dto';
import { PaintingCredentialsDto } from './dto/painting-credentials.dto';
import ImageDto from "../image/dto/image.dto";

@Controller('artists/:artistId/paintings')
export class PaintingController {
  constructor(
    private readonly paintingService: PaintingService,
  ) {}

  @Get()
  async findAll(@Param('artistId') artistId: string): Promise<IPainting[]> {
    return this.paintingService.findAll(artistId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() image: ImageDto,
    @Param('artistId') artistId: string,
    @Body(ValidationPipe) paintingCredentials: PaintingCredentialsDto,
  ): Promise<IPainting | never> {
    return this.paintingService.create(artistId, paintingCredentials, image);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<IPainting | never> {
    return this.paintingService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Param('artistId') artistId: string,
    @Body(ValidationPipe) paintingCredentials: Partial<PaintingCredentialsDto>,
    @UploadedFile() image?: ImageDto,
  ): Promise<IPainting | never> {
    return this.paintingService.update(artistId, id, paintingCredentials, image);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<Types.ObjectId | never> {
    return await this.paintingService.deleteOne(id);
  }
}
