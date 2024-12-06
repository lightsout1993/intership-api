import type { Sharp } from 'sharp';

export interface IImage {
  src: string;
  webp: string;
  src2x: string;
  webp2x: string;
  original: string;
  placeholder: string;
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

export type ImageType = 'avatar' | 'painting';
