import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageService } from './image.service';
import { Image, ImageSchema } from './schemas/image.schema';

@Module({
  exports: [ImageService],
  providers: [ImageService],
  imports: [MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }])],
})
export class ImageModule {}
