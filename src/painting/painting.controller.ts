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
  UseInterceptors, UnprocessableEntityException, Patch,
} from '@nestjs/common';
import type { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

import type ImageDto from '../image/dto/image.dto';
import { PaintingService } from './painting.service';
import type { IPainting } from './painting.interface';
import type { PaintingCredentialsDto } from './dto/painting-credentials.dto';

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
    @Param('artistId') artistId: string,
    @Body(ValidationPipe) paintingCredentials: PaintingCredentialsDto,
    @UploadedFile() image: ImageDto,
  ): Promise<IPainting | never> {
    if (!image) {
      throw new UnprocessableEntityException('Image is required');
    }

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
