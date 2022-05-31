import type { Types } from 'mongoose';
import type { GenreCredentialsDto } from './dto/genre-credentials.dto';
import type IGenre from './genre.interface';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { GenreService } from './genre.service';
import { GenreBody } from './swagger/GenreBody.swagger';
import { GenreDeleteResponse } from './swagger/GenreDeleteResponse.swagger';
import { GenreResponse } from './swagger/GenreResponse.swagger';

@ApiTags('genres')
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('static')
  @ApiOkResponse({ type: GenreResponse, isArray: true })
  async findAllStatic(): Promise<IGenre[]> {
    return await this.genreService.findAllStatic();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: GenreResponse, isArray: true })
  async findAll(): Promise<IGenre[]> {
    return this.genreService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: GenreResponse })
  async findOne(@Param('id') id: string): Promise<IGenre | never> {
    return this.genreService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: GenreBody })
  @ApiResponse({ status: 201, type: GenreResponse })
  async create(
    @Body(ValidationPipe) genreCredentials: GenreCredentialsDto,
  ): Promise<IGenre | never> {
    return this.genreService.create(genreCredentials);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: GenreBody })
  @ApiOkResponse({ type: GenreResponse })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) genreCredentials: GenreCredentialsDto,
  ): Promise<IGenre | never> {
    return this.genreService.update(id, genreCredentials);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ type: GenreDeleteResponse })
  async remove(@Param('id') id: string): Promise<Types.ObjectId | never> {
    return await this.genreService.deleteOne(id);
  }
}
