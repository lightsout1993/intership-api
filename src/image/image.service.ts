import { Model } from 'mongoose';
import sharp, { Sharp } from 'sharp';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as fs from 'fs';
import {
  createPublicPaths,
  createStoragePaths,
  getResizeCredentials,
  getConvertCredentials,
} from './utils.image';
import ImageDto from './dto/image.dto';
import { Image } from './schemas/image.schema';
import { IImage, Images } from './image.interface';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name) private readonly ImageModel: Model<Image>,
  ) {}

  async create(imageFile: ImageDto, path: string): Promise<Image> {
    const buffer = await sharp(imageFile.buffer);
    const jpeg = await ImageService.toJpeg(buffer);
    const webp = await ImageService.toWebp(buffer);
    const jpegs = await ImageService.getResizableImages(jpeg);
    const webps = await ImageService.getResizableImages(webp);

    const paths: IImage = await ImageService.saveFiles(path, jpeg, jpegs, webps);

    const image = new this.ImageModel(paths);
    await image.save();

    return image;
  }

  static async remove(path: string): Promise<void> {
    const pathDir = `storage/images/${path}`;
    const files = await fs.promises.readdir(pathDir);
    await Promise.all(files.map(async (file) => await fs.promises.unlink(`${pathDir}/${file}`)));
    await fs.promises.rmdir(pathDir);
  }

  private static async saveFiles(
    path: string,
    original: sharp.Sharp,
    jpegs: Images,
    webps: Images,
  ) {
    await fs.promises.mkdir(`storage/images/${path}`, { recursive: true });
    const paths = createStoragePaths(path);

    await Promise.all([
      jpegs.image.toFile(paths.src),
      webps.image.toFile(paths.webp),
      original.toFile(paths.original),
      jpegs.image2x.toFile(paths.src2x),
      webps.image2x.toFile(paths.webp2x),
    ]);

    return createPublicPaths(path);
  }

  private static async getResizableImages(sharpBuffer: Sharp): Promise<Images> {
    const image = await ImageService.resize(sharpBuffer);
    const image2x = await ImageService.resize2x(sharpBuffer);

    return { image, image2x };
  }

  private static async toWebp(sharpBuffer: Sharp): Promise<Sharp> {
    return await sharpBuffer.clone().webp(getConvertCredentials());
  }

  private static async toJpeg(sharpBuffer: Sharp): Promise<Sharp> {
    return await sharpBuffer.clone().jpeg(getConvertCredentials());
  }

  private static async resize(sharpBuffer: Sharp): Promise<Sharp> {
    return sharpBuffer.clone().resize(getResizeCredentials());
  }

  private static async resize2x(sharpBuffer: Sharp): Promise<Sharp> {
    return sharpBuffer.clone().resize(getResizeCredentials(2));
  }
}
