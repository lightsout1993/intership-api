import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';

import { UserModule } from 'src/user/user.module';
import { GenreModule } from 'src/genre/genre.module';
import { ImageModule } from 'src/image/image.module';
import { ArtistModule } from 'src/artist/artist.module';
import { CountryModule } from 'src/country/country.module';
import { PaintingModule } from 'src/painting/painting.module';

import { MainSeeder } from './main.seeder';

@Module({
  providers: [MainSeeder],
  imports: [
    ArtistModule,
    UserModule,
    GenreModule,
    CountryModule,
    ImageModule,
    PaintingModule,
    CommandModule,
  ],
})
export class SeederModule {}
