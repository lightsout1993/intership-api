import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImageModule } from '../image/image.module';
import { PaintingService } from './painting.service';
import { PaintingController } from './painting.controller';
import { Painting, PaintingSchema } from './schemas/painting.schema';
import { Artist, ArtistSchema } from '../artist/schemas/artist.schema';

@Module({
  providers: [PaintingService],
  controllers: [PaintingController],
  imports: [
    ImageModule,
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MongooseModule.forFeature([{ name: Painting.name, schema: PaintingSchema }]),
  ],
})
export class PaintingModule {}
