import {
  Body, Controller, Post, ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { TokensDto } from './dto/tokens.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshCredentialsDto } from './dto/refresh-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<TokensDto> {
    return this.authService.register(authCredentialsDto);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<TokensDto> {
    return this.authService.login(authCredentialsDto);
  }

  @Post('refresh')
  async refresh(
    @Body(ValidationPipe) refreshCredentialsDto: RefreshCredentialsDto,
  ): Promise<TokensDto> {
    return this.authService.refresh(refreshCredentialsDto);
  }
}
