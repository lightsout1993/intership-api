import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { IToken } from './token.interface';
import { Token } from './schemas/token.schema';
import { TokensDto } from '../auth/dto/tokens.dto';
import { User } from '../user/schemas/user.schema';
import { RefreshCredentialsDto } from '../auth/dto/refresh-credentials.dto';
import { IUser } from '../user/user.interface';

@Injectable()
export class TokenService {
  constructor(@InjectModel(Token.name) private readonly TokenModel: Model<Token>) {}

  async create(
    user: IUser,
    tokensDto: TokensDto,
    fingerprint: string,
  ): Promise<TokensDto> {
    const userId: Types.ObjectId = user._id;
    const tokens = await this.TokenModel.find({ userId });

    if (tokens.length >= 5) {
      await this.remove(userId);
    }

    const { refreshToken } = tokensDto;
    const token = await new this.TokenModel({ userId, refreshToken, fingerprint });
    token.save();

    return tokensDto;
  }

  async check(
    refreshCredentialsDto: RefreshCredentialsDto,
  ): Promise<IToken> {
    const { refreshToken, fingerprint } = refreshCredentialsDto;

    const token: Token = await this.TokenModel.findOne({ refreshToken });

    if (token && token.fingerprint !== fingerprint) {
      return await this.remove(token.userId);
    }

    return token;
  }

  private async remove(userId: Types.ObjectId): Promise<IToken> {
    return await this.TokenModel.remove({ userId });
  }

  async update(
    _id: Types.ObjectId,
    { refreshToken }: TokensDto,
    fingerprint: string,
  ): Promise<IToken> {
    return await this.TokenModel.update(
      { _id }, { $set: { refreshToken, fingerprint } },
    );
  }
}
