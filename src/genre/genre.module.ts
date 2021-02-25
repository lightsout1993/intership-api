import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { Genre, GenreSchema } from './schemas/genre.schema';

@Module({
  providers: [GenreService],
  controllers: [GenreController],
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
  ],
})
export class GenreModule {}
