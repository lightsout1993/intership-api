import type { AuthCredentialsDto } from './dto/auth-credentials.dto';
import type { RefreshCredentialsDto } from './dto/refresh-credentials.dto';
import type { TokensDto } from './dto/tokens.dto';

import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginBody } from './swagger/AuthLoginBody.swagger';
import { AuthRefreshBody } from './swagger/AuthRefreshBody.swagger';
import { AuthRegisterBody } from './swagger/AuthRegisterBody.swagger';
import { AuthResponse } from './swagger/AuthResponse.swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: AuthRegisterBody })
  @ApiResponse({ status: 201, type: AuthResponse })
  async register(@Body(ValidationPipe) authCredentials: AuthCredentialsDto): Promise<TokensDto> {
    return this.authService.register(authCredentials);
  }

  @Post('login')
  @ApiBody({ type: AuthLoginBody })
  @ApiResponse({ status: 201, type: AuthResponse })
  async login(@Body(ValidationPipe) authCredentials: AuthCredentialsDto): Promise<TokensDto> {
    return this.authService.login(authCredentials);
  }

  @Post('refresh')
  @ApiBody({ type: AuthRefreshBody })
  @ApiResponse({ status: 201, type: AuthResponse })
  async refresh(
    @Body(ValidationPipe) refreshCredentials: RefreshCredentialsDto,
  ): Promise<TokensDto> {
    return this.authService.refresh(refreshCredentials);
  }
}
