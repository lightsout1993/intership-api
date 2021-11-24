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
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

import { PaintingService } from 'src/painting/painting.service';
import { IPainting } from 'src/painting/painting.interface';
import { PaintingCredentialsDto } from 'src/painting/dto/painting-credentials.dto';
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
    private readonly paintingService: PaintingService,
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
  async remove(@Param('id') id: string): Promise<Types.ObjectId | never> {
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

  @Get(':id/paintings')
  async findAllPaintings(@Param('id') id: string): Promise<IPainting[]> {
    return this.paintingService.findAll(id);
  }

  @Post(':id/paintings')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, callback) => {
        const mimeTypeList = ['image/png', 'image/jpeg'];
        return mimeTypeList.some((item) => item === file.mimetype)
          ? callback(null, true)
          : callback(
              new HttpException(
                'Only images type as PNG or JPEG are allowed',
                HttpStatus.NOT_ACCEPTABLE,
              ),
              false,
            );
      },
    }),
  )
  async createPainting(
    @Param('id') id: string,
    @Body(ValidationPipe) paintingCredentials: PaintingCredentialsDto,
    @UploadedFile() image: ImageDto,
  ): Promise<IPainting | never> {
    if (!image) {
      throw new UnprocessableEntityException('Image is required');
    }
    return this.paintingService.create(id, paintingCredentials, image);
  }

  @Get(':id/paintings/:paintingId')
  async findOnePainting(@Param('paintingId') paintingId: string): Promise<IPainting | never> {
    return this.paintingService.findOne(paintingId);
  }

  @Put(':id/paintings/:paintingId')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, callback) => {
        const mimeTypeList = ['image/png', 'image/jpeg'];
        return mimeTypeList.some((item) => item === file.mimetype)
          ? callback(null, true)
          : callback(
              new HttpException(
                'Only images type as PNG or JPEG are allowed',
                HttpStatus.NOT_ACCEPTABLE,
              ),
              false,
            );
      },
    }),
  )
  async updatePainting(
    @Param('id') id: string,
    @Param('paintingId') paintingId: string,
    @Body(ValidationPipe) paintingCredentials: Partial<PaintingCredentialsDto>,
    @UploadedFile() image?: ImageDto,
  ): Promise<IPainting | never> {
    return this.paintingService.update(id, paintingId, paintingCredentials, image);
  }

  @Delete(':id/paintings/:paintingId')
  async removePainting(@Param('paintingId') paintingId: string): Promise<Types.ObjectId | never> {
    return await this.paintingService.deleteOne(paintingId);
  }
}
