import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArtistService } from './artist.service';
import { ImageModule } from '../image/image.module';
import { ArtistController } from './artist.controller';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Genre, GenreSchema } from '../genre/schemas/genre.schema';
import { Painting, PaintingSchema } from '../painting/schemas/painting.schema';

@Module({
  providers: [ArtistService],
  controllers: [ArtistController],
  imports: [
    ImageModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MongooseModule.forFeature([{ name: Painting.name, schema: PaintingSchema }]),
  ],
})
export class ArtistModule {}
