import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '@/user/user.module';
import { ImageModule } from '@/image/image.module';
import { User, UserSchema } from '@/user/schemas/user.schema';
import { Genre, GenreSchema } from '@/genre/schemas/genre.schema';
import { Painting, PaintingSchema } from '@/painting/schemas/painting.schema';

import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { GenreModule } from '@/genre/genre.module';

@Module({
  exports: [ArtistService],
  providers: [ArtistService],
  controllers: [ArtistController],
  imports: [
    UserModule,
    GenreModule,
    ImageModule,
    MongooseModule.forFeature([
      { name: Painting.name, schema: PaintingSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
  ],
})
export class ArtistModule {}
