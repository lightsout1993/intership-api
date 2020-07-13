import {
  connect, connection, disconnect, Mongoose,
} from 'mongoose';
import { ConfigService } from '@nestjs/config';

export const databaseProvider = {
  provide: 'DB_CONNECTION',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<Mongoose> => {
    const URI = 'uri';
    const RECONNECT_INTERVAL = 'reconnectInterval';
    let reConnectionTask = null;

    function dbConnection() {
      return connect(configService.get(URI), {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      });
    }

    connection.on('connecting', () => {
      console.log('Connecting...');
    });

    connection.on('open', () => {
      console.info('Open！');
      clearTimeout(reConnectionTask);
      reConnectionTask = null;
    });

    connection.on('disconnected', () => {
      console.error(`Disconnected！Reconnect after ${configService.get(RECONNECT_INTERVAL) / 1000}s`);
      reConnectionTask = setTimeout(dbConnection, configService.get(RECONNECT_INTERVAL));
    });

    connection.on('error', (error) => {
      console.error('Error！', error);
      disconnect();
    });

    // eslint-disable-next-line no-return-await
    return await dbConnection();
  },
};
