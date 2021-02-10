import {
  raw,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import type { IToken } from '../token.interface';
import { UserSchema } from '../../user/schemas/user.schema';

@Schema()
export class Token extends Document implements IToken {
  @Prop()
  refreshToken: string;

  @Prop()
  fingerprint: string;

  @Prop(raw({ ref: UserSchema }))
  userId: Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
