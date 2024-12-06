import type { User as UserModel } from '@/user/schemas/user.schema';

export interface IArtist {
  name: string;
  description: string;
  yearsOfLife: string;
}

export interface ISortParams {
  sortBy?: string;
  orderBy?: 'asc' | 'desc';
}

export interface IPaginationParams {
  count?: number;
  offset?: number;
}

export interface IFindAllParams extends ISortParams, IPaginationParams {
  user: UserModel;
  country?: string;
  genres?: string[];
}
