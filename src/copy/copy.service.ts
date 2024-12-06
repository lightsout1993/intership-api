import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '@/user/schemas/user.schema';
import { Artist } from '@/artist/schemas/artist.schema';
import { Painting } from '@/painting/schemas/painting.schema';

@Injectable()
export class CopyService {
  constructor(
    @InjectModel(Artist.name) private readonly ArtistModel: Model<Artist>,
    @InjectModel(Painting.name) private readonly PaintingModel: Model<Painting>,
  ) {}

  async copyUser(user: User, demoUser: User) {
    const demoArtists = await this.ArtistModel.find({
      user: demoUser._id,
    })
      .populate('paintings')
      .populate('avatar')
      .populate('genres')
      .lean();

    for (const { _id, ...demoArtist } of demoArtists) {
      const artist = await new this.ArtistModel({
        ...demoArtist,
        user: user._id,
      });

      for (const demoPainting of demoArtist.paintings) {
        const painting = await new this.PaintingModel({
          ...demoPainting,
          artist: artist._id,
        });

        await painting.save();
      }

      await artist.save();
    }
  }
}
