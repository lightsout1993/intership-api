import type { Types } from 'mongoose';

import type { ArtistCredentialsDto } from './dto/artist-credentials.dto';

import { Image } from '../image/schemas/image.schema';
import { Genre } from '../genre/schemas/genre.schema';
import { User as UserModel } from '../user/schemas/user.schema';

export interface IArtist {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  yearsOfLife: string;
}

export interface Meta {
  count: number;
  perPage?: number;
  pageNumber?: number;
}

export interface IArtistsResponse {
  meta: Meta;
  data: IArtist[];
}

export interface IFindAllParams {
  user: UserModel;
  sortBy?: string;
  country?: string;
  perPage?: number;
  genres?: string[];
  pageNumber?: number;
  orderBy?: 'asc' | 'desc';
}

export type ArtistUpdateCredentials = Omit<
  ArtistCredentialsDto,
  'mainPainting' | 'genres'
> & { genres: Genre[]; avatar: Image };
