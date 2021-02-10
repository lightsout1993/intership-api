import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { ArtistModule } from './artist/artist.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, AuthModule, ArtistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
