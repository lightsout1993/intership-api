import type { IImage } from '../image.interface';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Image extends Document implements IImage {
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
}

export const ImageSchema = SchemaFactory.createForClass(Image);
