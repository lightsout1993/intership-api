import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import type { IArtist } from '../artist.interface';
import type { User } from '../../user/schemas/user.schema';
import type { Image } from '../../image/schemas/image.schema';
import type { Painting } from '../../painting/schemas/painting.schema';

@Schema()
export class Artist extends Document implements IArtist {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  yearsOfLife: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Image' })
  avatar: Image;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Painting' }] })
  paintings: Painting[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
