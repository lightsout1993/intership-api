import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { Painting, PaintingSchema } from '../painting/schemas/painting.schema';

@Module({
  providers: [ArtistService],
  controllers: [ArtistController],
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MongooseModule.forFeature([{ name: Painting.name, schema: PaintingSchema }]),
  ],
})
export class ArtistModule {}
