import type {
  IImage,
  ResizeCredentials,
  ConvertCredentials,
} from './image.interface';

export const MAX_SIZE = 2000;

const defaultSizes = {
  avatar: {
    width: 1000,
    height: 1000,
  },
  painting: {
    width: 392,
    height: 260,
  },
};

const outputQuality = 90;

export const getResizeCredentials = (
  type = 'painting',
  factor = 1,
): ResizeCredentials => ({
  fit: 'inside',
  width: defaultSizes[type].width * factor,
  height: defaultSizes[type].height * factor,
});

export const getConvertCredentials = (
  quality = outputQuality,
): ConvertCredentials => ({
  quality,
  force: true,
});

export const createPaths = (prefix: string, path: string): IImage => ({
  src: `${prefix}images/${path}/image.jpg`,
  webp: `${prefix}images/${path}/image.webp`,
  src2x: `${prefix}images/${path}/image2x.jpg`,
  webp2x: `${prefix}images/${path}/image2x.webp`,
  original: `${prefix}images/${path}/original.jpg`,
  placeholder: `${prefix}images/${path}/placeholder.jpg`,
});

export const createPublicPaths = (path: string): IImage =>
  createPaths('/', path);

export const createStoragePaths = (path: string): IImage =>
  createPaths('storage/', path);
