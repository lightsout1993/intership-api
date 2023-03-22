import { Document, Types } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

import type { IToken } from '@/token/token.interface';
import type { User } from '@/user/schemas/user.schema';

import { Schema } from '@/internal/decorators/schema.decorator';

@Schema()
export class Token extends Document implements IToken {
  @Prop()
  refreshToken: string;

  @Prop()
  fingerprint: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
