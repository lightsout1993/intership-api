import { Document } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

import { Schema } from '@/internal/decorators/schema.decorator';

@Schema()
export class Genre extends Document {
  @Prop()
  name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
