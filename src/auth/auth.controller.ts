import {
  Body, Controller, Post, ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import type { TokensDto } from './dto/tokens.dto';
import type { AuthCredentialsDto } from './dto/auth-credentials.dto';
import type { RefreshCredentialsDto } from './dto/refresh-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(ValidationPipe) authCredentials: AuthCredentialsDto,
  ): Promise<TokensDto> {
    return this.authService.register(authCredentials);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) authCredentials: AuthCredentialsDto,
  ): Promise<TokensDto> {
    return this.authService.login(authCredentials);
  }

  @Post('refresh')
  async refresh(
    @Body(ValidationPipe) refreshCredentials: RefreshCredentialsDto,
  ): Promise<TokensDto> {
    return this.authService.refresh(refreshCredentials);
  }
}
