import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { ArtistModule } from './artist/artist.module';
import { DatabaseModule } from './database/database.module';
import { PaintingModule } from './painting/painting.module';

@Module({
  imports: [
    AuthModule,
    ArtistModule,
    DatabaseModule,
    PaintingModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
