import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from 'src/user/user.module';
import { PaintingModule } from 'src/painting/painting.module';
import { ArtistService } from './artist.service';
import { ImageModule } from '../image/image.module';
import { GenreModule } from '../genre/genre.module';
import { CountryModule } from '../country/country.module';
import { ArtistController } from './artist.controller';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Genre, GenreSchema } from '../genre/schemas/genre.schema';
import { Painting, PaintingSchema } from '../painting/schemas/painting.schema';

@Module({
  providers: [ArtistService],
  controllers: [ArtistController],
  imports: [
    GenreModule,
    UserModule,
    ImageModule,
    CountryModule,
    PaintingModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MongooseModule.forFeature([{ name: Painting.name, schema: PaintingSchema }]),
  ],
  exports: [ArtistService],
})
export class ArtistModule {}
