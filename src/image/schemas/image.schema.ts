import { Document } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

import { Schema } from '@/internal/decorators/schema.decorator';

@Schema()
export class Image extends Document {
  @Prop()
  original: string;

  @Prop()
  src: string;

  @Prop()
  src2x: string;

  @Prop()
  webp: string;

  @Prop()
  webp2x: string;

  @Prop()
  placeholder: string;

  @Prop()
  nonRemovable: boolean;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
