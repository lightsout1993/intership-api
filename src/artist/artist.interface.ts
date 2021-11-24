import type { Types } from 'mongoose';
import { DocumentQuery } from 'mongoose';
import { Artist } from './schemas/artist.schema';
import { ArtistCredentialsDto } from './dto/artist-credentials.dto';
import { Image } from '../image/schemas/image.schema';
import { Genre } from '../genre/schemas/genre.schema';

export interface IArtist {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  yearsOfLife: string;
}

interface Meta {
  count: number;
  perPage?: number;
  pageNumber?: number;
}

export interface IArtistsResponse {
  meta: Meta;
  data: IArtist[];
}

export interface IPaginationCredentials {
  perPage?: number;
  pageNumber?: number;
}

export interface IFiltersCredentials {
  country?: string;
  genres?: string[];
}

export interface ISortingCredentials {
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

export type ArtistQuery<T> = DocumentQuery<T, Artist>;

export type ArtistUpdateCredentials = Omit<ArtistCredentialsDto, 'mainPainting' | 'genres'> & {
  genres: Genre[];
  avatar: Image;
};
