import { Get, UseGuards, Controller, Query } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CountryService } from './country.service';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('name') name?: string): Promise<string[]> {
    return this.countryService.findAll(name);
  }
}
