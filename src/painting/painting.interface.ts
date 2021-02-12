import type { Types } from 'mongoose';

export interface IPainting {
  _id?: Types.ObjectId;
  name: string;
  yearOfCreation: string;
}
