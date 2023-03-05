import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { JWTProvider } from './jwt/jwt.provider';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';

@Module({
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    UserModule,
    TokenModule,
    ConfigModule,
    JwtModule.registerAsync(JWTProvider),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class AuthModule {}
