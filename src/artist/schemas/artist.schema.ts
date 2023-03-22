import { Document, Types } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

import type { User } from '@/user/schemas/user.schema';
import type { IArtist } from '@/artist/artist.interface';
import type { Genre } from '@/genre/schemas/genre.schema';
import type { Image } from '@/image/schemas/image.schema';
import type { Painting } from '@/painting/schemas/painting.schema';

import { Schema } from '@/internal/decorators/schema.decorator';

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
  mainPainting: Painting;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Genre' }] })
  genres: Genre[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Painting' }] })
  paintings: Painting[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
