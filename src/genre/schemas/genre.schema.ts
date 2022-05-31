import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import IGenre from '../genre.interface';

@Schema({ versionKey: false })
export class Genre extends Document implements Omit<IGenre, '_id'> {
  @Prop()
  name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
