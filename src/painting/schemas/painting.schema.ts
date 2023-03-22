import { Document, Types } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

import type { Image } from '@/image/schemas/image.schema';
import type { IPainting } from '@/painting/painting.interface';

import { Schema } from '@/internal/decorators/schema.decorator';

@Schema()
export class Painting extends Document implements IPainting {
  @Prop()
  name: string;

  @Prop()
  yearOfCreation: string;

  @Prop({ type: Types.ObjectId, ref: 'Image' })
  image: Image;
}

export const PaintingSchema = SchemaFactory.createForClass(Painting);
