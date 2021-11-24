import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { CommandModule } from 'nestjs-command';
import { AuthModule } from './auth/auth.module';
import { GenreModule } from './genre/genre.module';
import { ArtistModule } from './artist/artist.module';
import { SeederModule } from './seeder/seeder.module';
import { CountryModule } from './country/country.module';
import { DatabaseModule } from './database/database.module';
import { PaintingModule } from './painting/painting.module';
import { CountryController } from './country/country.controller';

@Module({
  imports: [
    AuthModule,
    GenreModule,
    ArtistModule,
    SeederModule,
    CountryModule,
    CommandModule,
    DatabaseModule,
    PaintingModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [CountryController],
})
export class AppModule {}
