import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import type { IArtist } from '../artist.interface';
import { Painting } from '../../painting/schemas/painting.schema';

@Schema()
export class Artist extends Document implements IArtist {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  yearsOfLife: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Painting' }] })
  paintings: Painting[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
