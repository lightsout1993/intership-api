import { Injectable, NotFoundException } from '@nestjs/common';

import Countries from './countries.static.json';

@Injectable()
export class CountryService {
  private readonly countries: string[];

  constructor() {
    this.countries = Countries;
  }

  async findAll(name?: string): Promise<string[]> {
    if (name) {
      const countries = this.countries.filter((country) => country.includes(name));

      if (!countries.length) CountryService.throwNotFoundException();

      return countries;
    }

    return this.countries;
  }

  findValidCountry(name?: string): string {
    const country = this.countries.find((countryName) => countryName === name);

    if (!country) CountryService.throwNotFoundException();

    return country;
  }

  private static throwNotFoundException(): never {
    throw new NotFoundException("Couldn't find a country");
  }
}
