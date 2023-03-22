import { Document } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

import type IGenre from '@/genre/genre.interface';

import { Schema } from '@/internal/decorators/schema.decorator';

@Schema()
export class Genre extends Document implements IGenre {
  @Prop()
  name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
