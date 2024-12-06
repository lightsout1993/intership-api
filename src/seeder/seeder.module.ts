import { Module } from '@nestjs/common';

import { UserModule } from '@/user/user.module';
import { GenreModule } from '@/genre/genre.module';
import { ArtistModule } from '@/artist/artist.module';
import { SeederCommand } from '@/seeder/seeder.command';
import { PaintingModule } from '@/painting/painting.module';

@Module({
  imports: [UserModule, GenreModule, ArtistModule, PaintingModule],
  providers: [SeederCommand],
})
export class SeederModule {}
