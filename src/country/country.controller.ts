import {
  Get,
  UseGuards,
  Controller,
} from '@nestjs/common';

import Countries from './countries.static.json';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('countries')
export class CountryController {
  private countries: string[];

  constructor() {
    this.countries = Countries;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<string[]> {
    return this.countries;
  }
}
