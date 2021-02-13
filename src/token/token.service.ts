import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { IToken } from './token.interface';
import { IUser } from '../user/user.interface';
import { Token } from './schemas/token.schema';
import { TokensDto } from '../auth/dto/tokens.dto';
import { RefreshCredentialsDto } from '../auth/dto/refresh-credentials.dto';
import { User } from '../user/schemas/user.schema';

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
  ): Promise<{ token: Token, tokensDto: TokensDto }> {
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

  async check(
    refreshCredentialsDto: RefreshCredentialsDto,
  ): Promise<IToken | null> {
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
    return this.TokenModel.updateOne({ _id }, { $set: { refreshToken, fingerprint } });
  }
}
