import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CopyService } from '@/copy/copy.service';
import { Artist, ArtistSchema } from '@/artist/schemas/artist.schema';
import { Painting, PaintingSchema } from '@/painting/schemas/painting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Painting.name, schema: PaintingSchema },
    ]),
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
  ],
  exports: [CopyService],
  providers: [CopyService],
})
export class CopyModule {}
