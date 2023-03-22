import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import type { IUser } from '@/user/user.interface';

import { UserService } from '@/user/user.service';
import { TokenService } from '@/token/token.service';

import type { TokensDto } from './dto/tokens.dto';
import type { JwtPayload } from './jwt/jwt-payload.interface';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register(authCredentials: AuthCredentialsDto): Promise<TokensDto> {
    const { username, fingerprint } = authCredentials;

    const user = await this.userService.register(authCredentials);
    const tokens: TokensDto = this.createTokens({ username });

    const token = await this.tokenService.create(
      user,
      fingerprint,
      tokens.refreshToken,
    );

    await user.updateOne({ $push: { tokens: token._id } }).exec();

    return tokens;
  }

  async login(
    fingerprint: string,
    username: string,
    password: string,
  ): Promise<TokensDto | never> {
    const user = await this.userService.validateUserPassword(
      username,
      password,
    );

    const tokens: TokensDto = this.createTokens({ username });

    const token = await this.tokenService.create(
      user,
      fingerprint,
      tokens.refreshToken,
    );

    await user.updateOne({ $push: { tokens: token._id } }).exec();

    return tokens;
  }

  async refresh(
    fingerprint: string,
    refreshToken: string,
  ): Promise<TokensDto | never> {
    let username: string;
    try {
      username = this.jwtService.verify<JwtPayload>(refreshToken).username;
    } catch {
      throw new UnauthorizedException(
        'Please, login. Refresh token not passed or has expired.',
      );
    }

    const token = await this.tokenService.check(fingerprint, refreshToken);

    if (!token) {
      throw new UnauthorizedException('Please, login. Token not found');
    }

    const tokens: TokensDto = this.createTokens({ username });
    await this.tokenService.update(token._id, tokens, fingerprint);

    return tokens;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.remove(refreshToken);
  }

  async validateUser(payload: JwtPayload): Promise<IUser> {
    const { username } = payload;
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('User is not authorized!');
    }

    return user;
  }

  private createTokens(jwtPayload: JwtPayload): TokensDto {
    return {
      accessToken: this.jwtService.sign(jwtPayload, { expiresIn: '4h' }),
      refreshToken: this.jwtService.sign(jwtPayload, { expiresIn: '4d' }),
    };
  }
}
