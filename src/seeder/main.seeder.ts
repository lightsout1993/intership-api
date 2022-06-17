import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import { Types } from 'mongoose';
import { Command } from 'nestjs-command';
import { ArtistService } from 'src/artist/artist.service';
import Artists from 'src/artist/artists.static.json';
import IGenre from 'src/genre/genre.interface';
import { GenreService } from 'src/genre/genre.service';
import Genres from 'src/genre/genres.static.json';
import { IPainting } from 'src/painting/painting.interface';
import { PaintingService } from 'src/painting/painting.service';
import Paintings from 'src/painting/paintings.static.json';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MainSeeder {
  constructor(
    private readonly artistService: ArtistService,
    private readonly userService: UserService,
    private readonly genreService: GenreService,
    private readonly paintingService: PaintingService,
  ) {}

  @Command({
    command: 'create:seeder',
    describe: 'create an seeder',
  })
  async create(): Promise<void> {
    await this.createUser();
    await this.createGenre();
    await this.createArtist();
    await this.createPainting();
  }

  async createUser(): Promise<void> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(process.env.DEMO_USER_PASSWORD, salt);

    await this.userService.create({
      _id: Types.ObjectId(process.env.DEMO_USER_ID),
      username: 'demoUser',
      password: passwordHash,
      salt,
    });
  }

  async createArtist(): Promise<void> {
    const genres = await this.genreService.findAllStatic();
    const demoUser = await this.userService.getDemoUser();

    await Promise.all(
      Artists.map(async ({ genres: artistGenres, ...restInfo }) => {
        const genresIds = artistGenres.map(
          (artistGenre) =>
            (
              genres.find((genre) => genre.name === artistGenre) as IGenre & {
                _id: string;
              }
            )._id,
        );

        const pathImage = MainSeeder.pathImage('avatars', restInfo.name);

        const avatar = await fs.promises.readFile(pathImage);
        const avatarSize = (await fs.promises.stat(pathImage)).size;

        return await this.artistService.create(
          demoUser,
          { ...restInfo, genres: genresIds },
          {
            buffer: avatar,
            size: avatarSize,
            encoding: '',
            fieldname: '',
            mimetype: '',
            originalname: '',
          },
        );
      }),
    );
  }

  async createGenre(): Promise<void> {
    await Promise.all(
      Genres.map(async (name) => {
        await this.genreService.create({ name });
      }),
    );
  }

  async createPainting(): Promise<void> {
    const artists = await this.artistService.findAllStatic();

    await Promise.all(
      artists.map(async ({ _id: artistId, name: artistName }) => {
        const currentArtistPaintings: {
          painting: IPainting;
          image: Buffer;
        }[] = [];

        await Promise.all(
          Paintings.map(async ({ imageUrl, name, created, authorName }) => {
            if (authorName === artistName) {
              const paintingFile = await fs.promises.readFile(imageUrl);

              currentArtistPaintings.push({
                painting: { name, yearOfCreation: created },
                image: paintingFile,
              });
            }
          }),
        );

        await Promise.all(
          currentArtistPaintings.map(async ({ painting, image }) => {
            await this.paintingService.create(artistId.toString(), painting, {
              originalname: painting.name,
              mimetype: '',
              fieldname: '',
              encoding: '',
              size: 0,
              buffer: image,
            });
          }),
        );
      }),
    );
  }

  private static pathImage(path: string, imageName: string): string {
    return `src/seeder/assets/${path}/${imageName}.jpg`;
  }
}
