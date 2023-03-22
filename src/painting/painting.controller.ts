import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  UploadedFile,
  ValidationPipe,
  UseInterceptors,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import type { User as UserModel } from '@/user/schemas/user.schema';

import { ImageDto } from '@/image/dto/image.dto';
import { ArtistService } from '@/artist/artist.service';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { User } from '@/internal/decorators/user.decorator';

import type { IPainting } from './painting.interface';

import { PaintingService } from './painting.service';
import { PaintingCredentialsDto } from './dto/painting-credentials.dto';
import { PartialPaintingCredentialsDto } from './dto/partial-painting-credentials.dto';

@Controller('artists/:artistId/paintings')
export class PaintingController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly paintingService: PaintingService,
  ) {}

  @Get()
  async findAll(
    @User() user: UserModel,
    @Param('artistId') artistId: string,
  ): Promise<IPainting[]> {
    const artist = await this.artistService.findById(user, artistId);

    return this.paintingService.findAll(artist);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @User() user: UserModel,
    @Param('artistId') artistId: string,
    @Body(ValidationPipe) paintingCredentials: PaintingCredentialsDto,
    @UploadedFile() image: ImageDto,
  ): Promise<IPainting | never> {
    if (!image) {
      throw new UnprocessableEntityException('Image is required');
    }

    const artist = await this.artistService.findById(user, artistId);

    return this.paintingService.create(artist, paintingCredentials, image);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IPainting | never> {
    return this.paintingService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @User() user: UserModel,
    @Param('id') id: string,
    @Param('artistId') artistId: string,
    @Body(ValidationPipe) paintingCredentials: PartialPaintingCredentialsDto,
    @UploadedFile(ValidationPipe) image?: ImageDto,
  ): Promise<IPainting | never> {
    const artist = await this.artistService.findById(user, artistId);

    return this.paintingService.update(artist, id, paintingCredentials, image);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @User() user: UserModel,
    @Param('artistId') artistId: string,
    @Param('id') id: string,
  ): Promise<string | never> {
    const artist = await this.artistService.findById(user, artistId);

    return this.paintingService.deleteOne(artist, id);
  }
}
