import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ArtistModule } from 'src/artist/artist.module';
import { Artist, ArtistSchema } from 'src/artist/schemas/artist.schema';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTProvider } from './jwt/jwt.provider';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ArtistModule,
    UserModule,
    TokenModule,
    ConfigModule,
    JwtModule.registerAsync(JWTProvider),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
  ],
})
export class AuthModule {}
