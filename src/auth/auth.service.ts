import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '@/user/user.service';
import { TokenService } from '@/token/token.service';

import type { TokensDto } from './dto/tokens.dto';
import type { JwtPayload } from './jwt/jwt-payload.interface';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisteredEvent } from '@/auth/events/RegisteredEvent';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async register(authCredentials: AuthCredentialsDto) {
    const { username, fingerprint } = authCredentials;

    const user = await this.userService.register(authCredentials);
    const tokens: TokensDto = this.createTokens({ username });

    const token = await this.tokenService.create(
      user,
      fingerprint,
      tokens.refreshToken,
    );

    await user.updateOne({ $push: { tokens: token._id } }).exec();

    this.eventEmitter.emit('registered', new RegisteredEvent(user));

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

  async logout(refreshToken: string) {
    await this.tokenService.remove(refreshToken);
  }

  async validateUser(payload: JwtPayload) {
    const { username } = payload;
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('User is not authorized!');
    }

    return user;
  }

  private createTokens(jwtPayload: JwtPayload) {
    return {
      accessToken: this.jwtService.sign(jwtPayload, { expiresIn: '4h' }),
      refreshToken: this.jwtService.sign(jwtPayload, { expiresIn: '4d' }),
    };
  }
}
