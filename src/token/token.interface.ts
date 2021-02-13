import type { Types } from 'mongoose';

export interface IToken {
  _id?: Types.ObjectId;
  fingerprint: string;
  refreshToken: string;
}
