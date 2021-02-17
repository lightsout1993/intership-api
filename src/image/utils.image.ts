import { ConvertCredentials, IImage, ResizeCredentials } from './image.interface';

const basicWidth = 500;
const basicHeight = 400;
const outputQuality = 80;

export const getResizeCredentials = (factor = 1): ResizeCredentials => ({
  fit: 'cover',
  width: basicWidth * factor,
  height: basicHeight * factor,
});

export const getConvertCredentials = (quality = outputQuality): ConvertCredentials => ({
  quality,
  force: true,
});

export const createPaths = (prefix: string, path: string): IImage => ({
  src: `${prefix}images/${path}/image.jpg`,
  webp: `${prefix}images/${path}/image.webp`,
  src2x: `${prefix}images/${path}/image2x.jpg`,
  webp2x: `${prefix}images/${path}/image2x.webp`,
  original: `${prefix}images/${path}/original.jpg`,
});

export const createPublicPaths = (path: string): IImage => createPaths('/', path);
export const createStoragePaths = (path: string): IImage => createPaths('storage/', path);
