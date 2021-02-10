import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

import type { IArtist } from '../artist.interface';

@Schema()
export class Artist extends Document implements IArtist {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  yearsOfLife: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
