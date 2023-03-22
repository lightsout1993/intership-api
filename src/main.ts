import fs from 'fs';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);

  if (!fs.existsSync('storage/images')) {
    await fs.promises.mkdir('storage/images', { recursive: true });
  }

  if (!fs.existsSync('public')) {
    await fs.promises.symlink('storage', 'public');
  }
}
bootstrap();
