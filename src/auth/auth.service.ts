import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { TokensDto } from './dto/tokens.dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshCredentialsDto } from './dto/refresh-credentials.dto';

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

    const { token, tokensDto } = await this.tokenService.create(
      user,
      tokens,
      fingerprint,
    );

    await user.updateOne({ $push: { tokens: token } });
    await user.save();

    return tokensDto;
  }

  async login(authCredentials: AuthCredentialsDto): Promise<TokensDto | never> {
    const { username, fingerprint } = authCredentials;

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userService.validateUserPassword(authCredentials);

    const tokens: TokensDto = this.createTokens({ username });

    const { tokensDto } = await this.tokenService.create(
      user,
      tokens,
      fingerprint,
    );

    return tokensDto;
  }

  async refresh(
    refreshCredentials: RefreshCredentialsDto,
  ): Promise<TokensDto | never> {
    const { refreshToken, fingerprint } = refreshCredentials;

    let username: string;
    try {
      username = this.jwtService.verify<JwtPayload>(refreshToken).username;
    } catch {
      throw new UnauthorizedException(
        'Please, login. Refresh token has expired.',
      );
    }

    const token = await this.tokenService.check(refreshCredentials);

    if (!token) {
      throw new UnauthorizedException('Please, login. Token not found');
    }

    const tokens: TokensDto = this.createTokens({ username });
    await this.tokenService.update(token._id, tokens, fingerprint);

    return tokens;
  }

  private createTokens(jwtPayload: JwtPayload): TokensDto {
    return {
      accessToken: this.jwtService.sign(jwtPayload, { expiresIn: '6h' }),
      refreshToken: this.jwtService.sign(jwtPayload, { expiresIn: '60d' }),
    };
  }
}
