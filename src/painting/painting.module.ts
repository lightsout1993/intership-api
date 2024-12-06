import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImageModule } from '@/image/image.module';
import { ArtistModule } from '@/artist/artist.module';
import { Artist, ArtistSchema } from '@/artist/schemas/artist.schema';

import { PaintingService } from './painting.service';
import { PaintingController } from './painting.controller';
import { Painting, PaintingSchema } from './schemas/painting.schema';

@Module({
  exports: [PaintingService],
  providers: [PaintingService],
  controllers: [PaintingController],
  imports: [
    ImageModule,
    ArtistModule,
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MongooseModule.forFeature([
      { name: Painting.name, schema: PaintingSchema },
    ]),
  ],
})
export class PaintingModule {}
