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

  async register(authCredentialsDto: AuthCredentialsDto): Promise<TokensDto> {
    const { username, fingerprint } = authCredentialsDto;

    const user = await this.userService.register(authCredentialsDto);
    const tokens: TokensDto = this.createTokens({ username });

    return await this.tokenService.create(
      user,
      tokens,
      fingerprint,
    );
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<TokensDto> {
    const { username, fingerprint } = authCredentialsDto;

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userService.validateUserPassword(
      authCredentialsDto,
    );

    const tokens: TokensDto = this.createTokens({ username });

    return await this.tokenService.create(
      user,
      tokens,
      fingerprint,
    );
  }

  async refresh(
    refreshCredentialsDto: RefreshCredentialsDto,
  ): Promise<TokensDto> {
    const { refreshToken, fingerprint } = refreshCredentialsDto;

    let username: string;
    try {
      username = this.jwtService.verify<JwtPayload>(refreshToken).username;
    } catch {
      throw new UnauthorizedException(
        'Please, login. Refresh token has expired.',
      );
    }

    const token = await this.tokenService.check(
      refreshCredentialsDto,
    );

    if (!token) {
      throw new UnauthorizedException('Please, login. Token not found');
    }

    const tokens: TokensDto = this.createTokens({ username });
    await this.tokenService.update(token._id, tokens, fingerprint);

    return tokens;
  }

  private createTokens(jwtPayload: JwtPayload): TokensDto {
    return {
      accessToken: this.jwtService.sign(jwtPayload),
      refreshToken: this.jwtService.sign(jwtPayload, { expiresIn: '60d' }),
    };
  }
}
