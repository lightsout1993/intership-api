import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ArtistModule } from 'src/artist/artist.module';
import { GenreModule } from 'src/genre/genre.module';
import { ImageModule } from 'src/image/image.module';
import { PaintingModule } from 'src/painting/painting.module';
import { UserModule } from 'src/user/user.module';
import { MainSeeder } from './main.seeder';

@Module({
  providers: [MainSeeder],
  imports: [ArtistModule, UserModule, GenreModule, ImageModule, PaintingModule, CommandModule],
})
export class SeederModule {}
