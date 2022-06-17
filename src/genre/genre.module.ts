import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { Genre, GenreSchema } from './schemas/genre.schema';

@Module({
  providers: [GenreService],
  controllers: [GenreController],
  imports: [UserModule, MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }])],
  exports: [GenreService],
})
export class GenreModule {}
