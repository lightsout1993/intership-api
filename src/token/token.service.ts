import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { TokensDto } from '@/auth/dto/tokens.dto';
import { User } from '@/user/schemas/user.schema';

import { Token } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Token.name) private readonly TokenModel: Model<Token>,
  ) {}

  async create(user: User, fingerprint: string, refreshToken: string) {
    const tokens = await this.TokenModel.find({ user: user._id }).exec();

    if (tokens.length >= 5) {
      const unnecessaryToken = tokens[0];
      this.remove(unnecessaryToken.refreshToken);
    }

    const token = new this.TokenModel({ user, refreshToken, fingerprint });

    return token.save();
  }

  async check(fingerprint: string, refreshToken: string) {
    const token = await this.TokenModel.findOne({ refreshToken });

    if (token && token.fingerprint !== fingerprint) {
      this.remove(token.refreshToken);
      return null;
    }

    return token;
  }

  async remove(token: string) {
    const tokenModel = await this.findByRefreshToken(token);

    this.UserModel.updateOne(
      { tokens: { $in: tokenModel._id } },
      { $pull: { tokens: tokenModel._id } },
    );
    tokenModel.deleteOne();
  }

  async update(_id: unknown, { refreshToken }: TokensDto, fingerprint: string) {
    this.TokenModel.updateOne(
      { _id },
      { $set: { refreshToken, fingerprint } },
    ).exec();
  }

  async findByRefreshToken(refreshToken: string) {
    return this.TokenModel.findOne({ refreshToken }).exec();
  }
}
