import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

import IGenre from '../genre.interface';

@Schema()
export class Genre extends Document implements IGenre {
  @Prop()
  name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
