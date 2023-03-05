import {
  Get,
  Req,
  Res,
  Body,
  Post,
  Controller,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshCredentialsDto } from './dto/refresh-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body(ValidationPipe) authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.register(
      authCredentials,
    );

    this.setCookie(response, refreshToken);

    return { accessToken };
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body(ValidationPipe)
    { fingerprint, password, username }: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.login(
      fingerprint,
      password,
      username,
    );

    this.setCookie(response, refreshToken);

    return { accessToken };
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body(ValidationPipe) { fingerprint }: RefreshCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const oldRefreshToken = request.cookies.refreshToken as string;

    const { accessToken, refreshToken } = await this.authService.refresh(
      fingerprint,
      oldRefreshToken,
    );

    this.setCookie(response, refreshToken);

    return { accessToken };
  }

  @Get('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const refreshToken = request.cookies.refreshToken as string;
    this.authService.logout(refreshToken);

    response.clearCookie('refreshToken');
  }

  setCookie(response: Response, refreshToken: string): void {
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
  }
}
