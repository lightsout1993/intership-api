import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImageModule } from '../image/image.module';
import { PaintingService } from './painting.service';
import { Painting, PaintingSchema } from './schemas/painting.schema';
import { Artist, ArtistSchema } from '../artist/schemas/artist.schema';

@Module({
  providers: [PaintingService],
  imports: [
    ImageModule,
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MongooseModule.forFeature([{ name: Painting.name, schema: PaintingSchema }]),
  ],
  exports: [PaintingService],
})
export class PaintingModule {}
