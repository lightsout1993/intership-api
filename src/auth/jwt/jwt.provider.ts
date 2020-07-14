import { ConfigModule, ConfigService } from '@nestjs/config';

import { jwtConfig } from './jwt.config';
import { JwtStrategy } from './jwt.strategy';

type JWTFactory = {
  secret: string,
  signOptions: {
    expiresIn: string,
  }
}

export const JWTProvider = {
  imports: [ConfigModule.forRoot({ load: [jwtConfig] })],
  useFactory: async (configService: ConfigService): Promise<JWTFactory> => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: '1h',
    },
  }),
  inject: [ConfigService],
  providers: [JwtStrategy],
};
