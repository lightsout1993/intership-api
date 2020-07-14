import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JWTProvider } from './jwt/jwt.provider';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    UserModule,
    TokenModule,
    JwtModule.registerAsync(JWTProvider),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
