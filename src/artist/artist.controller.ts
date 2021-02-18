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
} from '@nestjs/common';
import type { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

import { ArtistService } from './artist.service';
import type { IArtist } from './artist.interface';
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

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@User() user: UserModel): Promise<IArtist[]> {
    return this.artistService.findAll(user);
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
}
