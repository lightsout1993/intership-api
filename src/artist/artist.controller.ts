import type { Types } from 'mongoose';
import type ImageDto from '../image/dto/image.dto';
import type { User as UserModel } from '../user/schemas/user.schema';
import type {
  IArtist,
  IArtistsResponse,
  IFiltersCredentials,
  IPaginationCredentials,
  ISortingCredentials,
} from './artist.interface';
import type { ArtistCredentialsDto } from './dto/artist-credentials.dto';

import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ImageBody } from 'src/image/swagger/ImageBody.swagger';
import { PaintingCredentialsDto } from 'src/painting/dto/painting-credentials.dto';
import { IPainting } from 'src/painting/painting.interface';
import { PaintingService } from 'src/painting/painting.service';
import { PaintingBody } from 'src/painting/swagger/PaintingBody.swagger';
import { PaintingDeleteResponse } from 'src/painting/swagger/PaintingDeleteResponse.swagger';
import { PaintingPutBody } from 'src/painting/swagger/PaintingPutBody.swagger';
import { PaintingResponse } from 'src/painting/swagger/PaintingResponse.swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from '../internal/decorators/user.decorator';
import { ArtistService } from './artist.service';
import { ArtistBody } from './swagger/ArtistBody.swagger';
import { ArtistDeleteResponse } from './swagger/ArtistDeleteResponse.swagger';
import { ArtistFindOneResponse } from './swagger/ArtistFindOneResponse.swagger';
import { ArtistPutBody } from './swagger/ArtistPutBody.swagger';
import { ArtistPutResponse } from './swagger/ArtistPutResponse.swagger';
import { ArtistResponse } from './swagger/ArtistResponse.swagger';
import { ArtistStaticResponse } from './swagger/ArtistStaticResponse.swagger';

@ApiTags('artists')
@Controller('artists')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly paintingService: PaintingService,
  ) {}

  @Get('static')
  @ApiOkResponse({
    type: ArtistStaticResponse,
    isArray: true,
  })
  async findAllStatic(): Promise<IArtist[]> {
    return await this.artistService.findAllStatic();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'sortBy', required: false, type: 'name' })
  @ApiQuery({ name: 'name', required: false, type: 'string' })
  @ApiQuery({ name: 'orderBy', required: false, type: 'asc | desc' })
  @ApiQuery({ name: 'perPage', required: false, type: 'number' })
  @ApiQuery({ name: 'genres', required: false, type: 'string[]' })
  @ApiQuery({ name: 'pageNumber', required: false, type: 'number' })
  @ApiOkResponse({
    type: ArtistResponse,
    isArray: true,
  })
  @ApiBearerAuth('JWT-auth')
  async findAll(
    @User() user: UserModel,
    @Query('sortBy') sortBy?: 'name',
    @Query('name') name?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
    @Query('perPage', new DefaultValuePipe(0), ParseIntPipe) perPage?: number,
    @Query('genres', new DefaultValuePipe([]), ParseArrayPipe) genres?: string[],
    @Query('pageNumber', new DefaultValuePipe(0), ParseIntPipe) pageNumber?: number,
  ): Promise<IArtistsResponse> {
    const filters: IFiltersCredentials = { genres, name };
    const sorting: ISortingCredentials = { sortBy, orderBy };
    const pagination: IPaginationCredentials = { perPage, pageNumber };
    return this.artistService.findAll(user, filters, sorting, pagination);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiBody({ type: ArtistBody })
  @ApiResponse({
    status: 201,
    type: ArtistResponse,
  })
  @ApiOperation({ summary: 'Создание артиста' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @User() user: UserModel,
    @Body(ValidationPipe) artistCredentials: ArtistCredentialsDto,
    @UploadedFile() avatar?: ImageDto,
  ): Promise<IArtist | never> {
    return this.artistService.create(user, artistCredentials, avatar);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ArtistFindOneResponse,
  })
  @ApiBearerAuth('JWT-auth')
  async findOne(@Param('id') id: string): Promise<IArtist | never> {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiBody({
    type: ArtistPutBody,
  })
  @ApiOkResponse({
    type: ArtistPutResponse,
  })
  @ApiBearerAuth('JWT-auth')
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
  @ApiOkResponse({
    type: ArtistDeleteResponse,
  })
  @ApiBearerAuth('JWT-auth')
  async remove(@Param('id') id: string): Promise<Types.ObjectId | never> {
    return await this.artistService.deleteOne(id);
  }

  @Patch(':id/main-painting')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: ImageBody,
  })
  @ApiBearerAuth('JWT-auth')
  async appointMainPainting(
    @Param('id') id: string,
    @Body(ValidationPipe) artistCredentials: Partial<ArtistCredentialsDto>,
  ): Promise<void | never> {
    return await this.artistService.appointMainPainting(id, artistCredentials.mainPainting);
  }

  @Get(':id/paintings')
  @ApiOkResponse({ type: PaintingResponse, isArray: true })
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
  @ApiResponse({ status: 201, type: PaintingResponse })
  @ApiBody({ type: PaintingBody })
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
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiOkResponse({ type: PaintingResponse })
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
  @ApiBody({ type: PaintingPutBody })
  @ApiOkResponse({ type: PaintingResponse })
  async updatePainting(
    @Param('id') id: string,
    @Param('paintingId') paintingId: string,
    @Body(ValidationPipe) paintingCredentials: Partial<PaintingCredentialsDto>,
    @UploadedFile() image?: ImageDto,
  ): Promise<IPainting | never> {
    return this.paintingService.update(id, paintingId, paintingCredentials, image);
  }

  @Delete(':id/paintings/:paintingId')
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiOkResponse({ type: PaintingDeleteResponse })
  async removePainting(
    @Param('id') id: string,
    @Param('paintingId') paintingId: string,
  ): Promise<Types.ObjectId | never> {
    return await this.paintingService.deleteOne(id, paintingId);
  }
}
