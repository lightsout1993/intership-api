import { Get, Controller } from '@nestjs/common';

import type IGenre from './genre.interface';

import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async findAll(): Promise<IGenre[]> {
    return this.genreService.findAll();
  }
}
