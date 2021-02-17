import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import type { IUser } from '../user.interface';
import type { Token } from '../../token/schemas/token.schema';

@Schema()
export class User extends Document implements IUser {
  @Prop()
  salt: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Token' }] })
  tokens: Token[]
}

export const UserSchema = SchemaFactory.createForClass(User);
