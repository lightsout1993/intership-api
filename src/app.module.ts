import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from './auth/auth.module';
import { GenreModule } from './genre/genre.module';
import { ArtistModule } from './artist/artist.module';
import { CountryModule } from './country/country.module';
import { DatabaseModule } from './database/database.module';
import { PaintingModule } from './painting/painting.module';
import { CountryController } from './country/country.controller';

@Module({
  imports: [
    AuthModule,
    GenreModule,
    ArtistModule,
    CountryModule,
    DatabaseModule,
    PaintingModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [CountryController],
})
export class AppModule {}
