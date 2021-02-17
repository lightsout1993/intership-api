import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import type { IToken } from '../token.interface';
import type { User } from '../../user/schemas/user.schema';

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
