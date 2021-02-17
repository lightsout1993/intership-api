import type { Sharp } from 'sharp';
import type { Types } from 'mongoose';

export interface IImage {
  _id?: Types.ObjectId;
  src: string;
  webp: string;
  src2x: string;
  webp2x: string;
  original: string;
}

export type Fit = 'contain' | 'cover' | 'fill' | 'inside' | 'outside';

export interface ResizeCredentials {
  fit: Fit;
  width: number;
  height: number;
}

export interface ConvertCredentials {
  quality: number;
  force: boolean;
}

export interface Images {
  image: Sharp;
  image2x: Sharp;
}
