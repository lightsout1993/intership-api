import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import type { IPainting } from '../painting.interface';
import type { Image } from '../../image/schemas/image.schema';
import type { Artist } from '../../artist/schemas/artist.schema';

@Schema()
export class Painting extends Document implements IPainting {
  @Prop()
  name: string;

  @Prop()
  yearOfCreation: string;

  @Prop({ type: Types.ObjectId, ref: 'Image' })
  image: Image;

  @Prop({ type: Types.ObjectId, ref: 'Artist' })
  artist: Artist;
}

export const PaintingSchema = SchemaFactory.createForClass(Painting);
