import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { TokensDto } from './dto/tokens.dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshCredentialsDto } from './dto/refresh-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto): Promise<any /* TokensDto */> {
    const { username, fingerprint } = authCredentialsDto;

    const user = await this.userService.register(authCredentialsDto);
    const tokens: TokensDto = this.createTokens({ username });

    // return await this.tokenService.create(
    //   user,
    //   tokens,
    //   fingerprint,
    // );

    return tokens;
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<any/* TokensDto */> {
    const { username, fingerprint } = authCredentialsDto;

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userService.validateUserPassword(
      authCredentialsDto,
    );

    const tokens: TokensDto = this.createTokens({ username });

    // return await this.tokenService.create(
    //   user,
    //   tokensDto,
    //   fingerprint,
    // );

    return tokens;
  }

  async refresh(
    refreshCredentialsDto: RefreshCredentialsDto,
  ): Promise<any/* TokensDto */> {
    const { refreshToken, fingerprint } = refreshCredentialsDto;

    let username: string;
    try {
      username = this.jwtService.verify<JwtPayload>(refreshToken).username;
    } catch {
      throw new UnauthorizedException(
        'Please, sign in with login form. Refresh token has expired.',
      );
    }

    const tokens: TokensDto = this.createTokens({ username });

    // await this.tokenService.refresh(refreshToken, tokens, fingerprint);

    return tokens;
  }

  private createTokens(jwtPayload: JwtPayload): TokensDto {
    return {
      accessToken: this.jwtService.sign(jwtPayload),
      refreshToken: this.jwtService.sign(jwtPayload, { expiresIn: '60d' }),
    };
  }
}
