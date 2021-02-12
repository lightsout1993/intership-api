import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { IPainting } from '../painting.interface';
import { Artist } from '../../artist/schemas/artist.schema';

@Schema()
export class Painting extends Document implements IPainting {
  @Prop()
  name: string;

  @Prop()
  yearOfCreation: string;

  @Prop({ type: Types.ObjectId, ref: 'Artist' })
  artist: Artist;
}

export const PaintingSchema = SchemaFactory.createForClass(Painting);
