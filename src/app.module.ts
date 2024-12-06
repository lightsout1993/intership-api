import { join } from 'path';
import { forwardRef, Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthModule } from '@/auth/auth.module';
import { GenreModule } from '@/genre/genre.module';
import { ArtistModule } from '@/artist/artist.module';
import { SeederModule } from '@/seeder/seeder.module';
import { DatabaseModule } from '@/database/database.module';
import { PaintingModule } from '@/painting/painting.module';
import { CopyModule } from '@/copy/copy.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    GenreModule,
    ArtistModule,
    PaintingModule,
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    SeederModule,
    CommandModule,
    CopyModule,
  ],
})
export class AppModule {}
