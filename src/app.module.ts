import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from './auth/auth.module';
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
})
export class AppModule {}
