import { Document, Types } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

import type { Token } from '@/token/schemas/token.schema';

import { Schema } from '@/internal/decorators/schema.decorator';

@Schema()
export class User extends Document {
  @Prop()
  salt: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Token' }] })
  tokens: Token[];
}

export const UserSchema = SchemaFactory.createForClass(User);
