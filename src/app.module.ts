import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommandModule } from 'nestjs-command';
import { join } from 'path';
import { ArtistModule } from './artist/artist.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { GenreModule } from './genre/genre.module';
import { PaintingModule } from './painting/painting.module';
import { SeederModule } from './seeder/seeder.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    AuthModule,
    GenreModule,
    ArtistModule,
    SeederModule,
    CommandModule,
    DatabaseModule,
    PaintingModule,
    TasksModule,
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [],
})
export class AppModule {}
