import { Request } from 'express';
import { Req, Body, Post, Controller, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshCredentialsDto } from './dto/refresh-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) authCredentials: AuthCredentialsDto) {
    return await this.authService.register(authCredentials);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe)
    { fingerprint, password, username }: AuthCredentialsDto,
  ) {
    return await this.authService.login(fingerprint, password, username);
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Body(ValidationPipe) { fingerprint, refreshToken }: RefreshCredentialsDto,
  ) {
    return await this.authService.refresh(fingerprint, refreshToken);
  }
}
