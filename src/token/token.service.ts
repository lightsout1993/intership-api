import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Token } from './schemas/token.schema';
import type { IToken } from './token.interface';
import { User } from '../user/schemas/user.schema';
import type { IUser } from '../user/user.interface';
import type { TokensDto } from '../auth/dto/tokens.dto';
import type { RefreshCredentialsDto } from '../auth/dto/refresh-credentials.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Token.name) private readonly TokenModel: Model<Token>,
  ) {}

  async create(
    userCredentials: IUser,
    tokensDto: TokensDto,
    fingerprint: string,
  ): Promise<{ token: Token; tokensDto: TokensDto }> {
    const user = await this.UserModel.findOne(userCredentials).exec();
    const tokens = await this.TokenModel.find({ user: user._id }).exec();

    if (tokens.length >= 5) {
      await this.remove(user);
    }

    const { refreshToken } = tokensDto;
    const token = new this.TokenModel({ user, refreshToken, fingerprint });
    await token.save();

    return { token, tokensDto };
  }

  async check(refreshCredentialsDto: RefreshCredentialsDto): Promise<IToken | null> {
    const { refreshToken, fingerprint } = refreshCredentialsDto;

    const token: Token = await this.TokenModel.findOne({ refreshToken });

    if (token && token.fingerprint !== fingerprint) {
      await this.remove(token.user);
      return null;
    }

    return token;
  }

  private async remove(user: IUser): Promise<void> {
    await this.TokenModel.remove({ user });
  }

  async update(
    _id: Types.ObjectId,
    { refreshToken }: TokensDto,
    fingerprint: string,
  ): Promise<IToken> {
    this.TokenModel.updateOne({ _id }, { $set: { refreshToken, fingerprint } });
    return this.TokenModel.findOne({ _id }).exec();
  }
}
