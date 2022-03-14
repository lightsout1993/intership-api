import fs from 'fs';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Conten-Type', 'Accept', 'Authorization']
  };
  app.enableCors(options)
  await app.listen(3000);

  if (!fs.existsSync('storage')) {
    await fs.promises.mkdir('storage/images', { recursive: true });
  }

  if (!fs.existsSync('public')) {
    await fs.promises.symlink('storage', 'public');
  }
}
bootstrap();
