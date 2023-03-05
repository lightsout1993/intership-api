import fs from 'fs';
import {Model, Types} from 'mongoose';
import sharp, { Sharp } from 'sharp';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import type { IImage, Images, ImageType } from './image.interface';

import {
  MAX_SIZE,
  createPublicPaths,
  createStoragePaths,
  getResizeCredentials,
  getConvertCredentials,
} from './utils.image';
import { ImageDto } from './dto/image.dto';
import { Image } from './schemas/image.schema';

@Injectable()
export class ImageService {
  type: ImageType = 'painting';

  constructor(
    @InjectModel(Image.name) private readonly ImageModel: Model<Image>,
  ) {}

  async create(
    imageFile: ImageDto,
    id: Types.ObjectId,
    type?: ImageType,
  ): Promise<Image> {
    this.type = type;

    const buffer = await sharp(imageFile.buffer);

    const original = buffer.resize({
      fit: 'inside',
      width: MAX_SIZE,
      height: MAX_SIZE,
    });

    const [jpeg, webp] = await Promise.all([
      ImageService.toJpeg(original),
      ImageService.toWebp(original),
    ]);

    const [jpegs, webps] = await Promise.all([
      this.getResizableImages(jpeg),
      this.getResizableImages(webp),
    ]);

    const placeholder = await ImageService.blur(jpegs.image2x);
    const paths: IImage = await ImageService.saveFiles(
      id.toString(),
      jpeg,
      jpegs,
      webps,
      placeholder,
    );

    const image = new this.ImageModel({ _id: id, ...paths });

    return image.save();
  }

  async remove(id: string): Promise<void | never> {
    const imageModel = await this.ImageModel.findById(id).exec();

    if (imageModel?.nonRemovable) {
      console.warn('This document is not allowed to be deleted');
      return;
    }

    try {
      imageModel.deleteOne();

      const pathDir = `storage/images/${id}`;
      const files = await fs.promises.readdir(pathDir);

      const unlinks = files.map((file) =>
        fs.promises.unlink(`${pathDir}/${file}`),
      );

      await Promise.all(unlinks);

      fs.promises.rmdir(pathDir);
    } catch (e) {
      console.error(e);
    }
  }

  private static async saveFiles(
    path: string,
    original: sharp.Sharp,
    jpegs: Images,
    webps: Images,
    placeholder: sharp.Sharp,
  ) {
    await fs.promises.mkdir(`storage/images/${path}`, { recursive: true });
    const paths = createStoragePaths(path);

    original.toFile(paths.original);
    placeholder.toFile(paths.placeholder);

    jpegs.image.toFile(paths.src);
    webps.image.toFile(paths.webp);

    jpegs.image2x.toFile(paths.src2x);
    webps.image2x.toFile(paths.webp2x);

    return createPublicPaths(path);
  }

  private async getResizableImages(sharpBuffer: Sharp): Promise<Images> {
    const [image, image2x] = await Promise.all([
      this.resize(sharpBuffer),
      this.resize2x(sharpBuffer),
    ]);

    return { image, image2x };
  }

  private static async blur(sharpBuffer: Sharp): Promise<Sharp> {
    return sharpBuffer
      .clone()
      .greyscale()
      .jpeg(getConvertCredentials(30))
      .blur(30);
  }

  private static async toWebp(sharpBuffer: Sharp): Promise<Sharp> {
    return sharpBuffer.clone().webp(getConvertCredentials());
  }

  private static async toJpeg(sharpBuffer: Sharp): Promise<Sharp> {
    return sharpBuffer.clone().jpeg(getConvertCredentials());
  }

  private async resize(sharpBuffer: Sharp, factor?: number): Promise<Sharp> {
    return sharpBuffer.clone().resize(getResizeCredentials(this.type, factor));
  }

  private async resize2x(sharpBuffer: Sharp): Promise<Sharp> {
    return this.resize(sharpBuffer, 2);
  }
}
