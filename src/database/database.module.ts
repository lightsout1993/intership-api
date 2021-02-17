import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { connectionProvider } from './connection.provider';

@Module({
  imports: [
    MongooseModule.forRootAsync(connectionProvider)],
})
export class DatabaseModule {}
