import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JWTProvider } from './jwt/jwt.provider';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    UserModule,
    TokenModule,
    JwtModule.registerAsync(JWTProvider),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class AuthModule {}
