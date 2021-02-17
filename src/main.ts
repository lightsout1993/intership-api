import fs from 'fs';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:63342' });
  await app.listen(3000);

  if (!fs.existsSync('storage')) await fs.promises.mkdir('storage/images', { recursive: true });
  if (!fs.existsSync('public')) await fs.promises.symlink('storage', 'public');
}
bootstrap();
