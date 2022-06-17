import type { Genre } from '../../genre/schemas/genre.schema';
import type { Image } from '../../image/schemas/image.schema';
import type { Painting } from '../../painting/schemas/painting.schema';
import type { User } from '../../user/schemas/user.schema';
import type { IArtist } from '../artist.interface';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Artist extends Document implements IArtist {
  @Prop()
  name: string;

  @Prop()
  country: string;

  @Prop()
  description: string;

  @Prop()
  yearsOfLife: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Image' })
  avatar: Image;

  @Prop({ type: Types.ObjectId, ref: 'Painting' })
  mainPainting: Painting | null;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Genre' }] })
  genres: Genre[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Painting' }] })
  paintings: Painting[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
