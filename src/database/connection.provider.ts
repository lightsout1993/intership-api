import { ConfigModule, ConfigService } from '@nestjs/config';

import { databaseConfig } from './database.config';

export const connectionProvider = {
  imports: [ConfigModule.forRoot({ load: [databaseConfig] })],
  useFactory: async (configService: ConfigService): Promise<{ uri: string }> => ({
    uri: configService.get('uri'),
  }),
  inject: [ConfigService],
};
