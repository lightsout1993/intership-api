import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';

import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    await app.select(CommandModule).get(CommandService).exec();
    await app.close();
    process.exit(1);
  } catch {
    await app.close();
    process.exit(1);
  }
};

bootstrap();
