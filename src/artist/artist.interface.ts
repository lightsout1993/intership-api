import type { Types } from 'mongoose';

export interface IArtist {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  yearsOfLife: string;
}

interface Meta {
  count: number;
  perPage: number;
  pageNumber: number;
}

export interface IArtistsResponse {
  meta: Meta;
  data: IArtist[];
}
