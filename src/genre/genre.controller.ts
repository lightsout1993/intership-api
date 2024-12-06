import { Get, Controller } from '@nestjs/common';

import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async findAll() {
    return this.genreService.findAll();
  }
}
