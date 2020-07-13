import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './database.config';
import { databaseProvider } from './database.providers';

@Module({
  imports: [ConfigModule.forRoot({ load: [databaseConfig] })],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
