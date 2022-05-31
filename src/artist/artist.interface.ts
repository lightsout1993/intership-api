import type { Types } from 'mongoose';

import { DocumentQuery } from 'mongoose';
import { Genre } from '../genre/schemas/genre.schema';
import { Image } from '../image/schemas/image.schema';
import { ArtistCredentialsDto } from './dto/artist-credentials.dto';
import { Artist } from './schemas/artist.schema';

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
  name?: string;
  genres?: string[];
}

export interface IArtistFilters {
  user: Types.ObjectId;
  name?: { $regex: string; $options: string };
  genres?: { $all: string[] };
}

export interface IArtistAggregateQuery {
  $match?: IArtistFilters;
  $project?: { paintings: boolean; user: boolean };
  $sort?: Record<string, 'asc' | 'desc'>;
  $skip?: number;
  $limit?: number;
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
