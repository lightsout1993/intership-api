import bcrypt from 'bcrypt';
import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

import {
  reedFile,
  getSizeFile,
  readJsonFile,
  readBufferFile,
} from '@/seeder/reedFile';
import Genres from '@/seeder/genres.json';
import { IArtistSeeder } from '@/seeder/types';
import { User } from '@/user/schemas/user.schema';
import { UserService } from '@/user/user.service';
import { GenreService } from '@/genre/genre.service';
import { setDemoUserId } from '@/user/utils/user.utils';
import { ArtistService } from '@/artist/artist.service';
import { PaintingService } from '@/painting/painting.service';

@Injectable()
export class SeederCommand {
  constructor(
    private readonly userService: UserService,
    private readonly genreService: GenreService,
    private readonly artistService: ArtistService,
    private readonly paintingService: PaintingService,
  ) {}

  @Command({
    command: 'seed',
    describe: 'seed data',
  })
  async execute(): Promise<void> {
    await this.createGenres();
    await this.createUser();
  }

  async createGenres() {
    for (const genre of Genres) {
      await this.genreService.create({ name: genre });
    }
  }

  async createUser() {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(process.env.DEMO_USER, salt);

    const user = await this.userService.create({
      salt,
      password: passwordHash,
      username: process.env.DEMO_USER,
    });

    await setDemoUserId(user._id.toString());
    await this.createArtists(user);
  }

  async createArtists(user: User) {
    const artistFolders = Array.from(
      { length: 6 },
      (_, i) => `${__dirname}/artists/${i + 1}`,
    );

    const artists = await Promise.all(
      artistFolders.map(
        (folder) =>
          readJsonFile(`${folder}/artist.json`) as Promise<IArtistSeeder>,
      ),
    );

    for (const [index, artist] of await artists.entries()) {
      const path = artistFolders[index];
      const avatar = await readBufferFile(`${path}/portrait.jpg`);
      const avatarSize = await getSizeFile(`${path}/portrait.jpg`);
      const description = await reedFile(`${path}/description.txt`);

      const artistSaved = await this.artistService.create(
        user,
        {
          description,
          name: artist.name,
          genres: artist.genres,
          country: artist.country,
          yearsOfLife: artist.yearsOfLife,
        },
        { buffer: avatar, nonRemovable: true, size: avatarSize },
      );

      for (const picture of await artist.pictures) {
        const pictureSize = await getSizeFile(`${path}${picture.image}`);
        const pictureImage = await readBufferFile(`${path}${picture.image}`);

        await this.paintingService.create(artistSaved, picture, {
          size: pictureSize,
          nonRemovable: true,
          buffer: pictureImage,
        });
      }
    }
  }
}
