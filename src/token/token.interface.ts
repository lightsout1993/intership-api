import { Types } from 'mongoose';

export interface IToken {
  _id: Types.ObjectId;

  refreshToken: string;

  fingerprint: string;

  userId: Types.ObjectId;
}
