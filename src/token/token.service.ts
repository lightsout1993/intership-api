import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import type { IToken } from './token.interface';

import { Token } from './schemas/token.schema';
import { TokensDto } from '../auth/dto/tokens.dto';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Token.name) private readonly TokenModel: Model<Token>,
  ) {}

  async create(
    user: User,
    fingerprint: string,
    refreshToken: string,
  ): Promise<Token> {
    const tokens = await this.TokenModel.find({ user: user._id }).exec();

    if (tokens.length >= 5) {
      const unnecessaryToken = tokens[0];
      this.remove(unnecessaryToken.refreshToken);
    }

    const token = new this.TokenModel({ user, refreshToken, fingerprint });

    return token.save();
  }

  async check(
    fingerprint: string,
    refreshToken: string,
  ): Promise<Token | null> {
    const token = await this.TokenModel.findOne({ refreshToken });

    if (token && token.fingerprint !== fingerprint) {
      this.remove(token.refreshToken);
      return null;
    }

    return token;
  }

  async remove(token: string): Promise<void> {
    const tokenModel = await this.findByRefreshToken(token);
    const params = { tokens: tokenModel._id };

    this.UserModel.updateOne({ $in: params }, { $pull: params });
    tokenModel.deleteOne();
  }

  async update(
    _id: Types.ObjectId,
    { refreshToken }: TokensDto,
    fingerprint: string,
  ): Promise<void> {
    this.TokenModel.updateOne(
      { _id },
      { $set: { refreshToken, fingerprint } },
    ).exec();
  }

  async findByRefreshToken(refreshToken: string): Promise<Token> {
    return this.TokenModel.findOne({ refreshToken }).exec();
  }
}
