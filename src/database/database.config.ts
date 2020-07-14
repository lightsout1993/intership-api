interface IDatabaseConfig {
  uri: string;
  username: string;
  password: string;
}

export const databaseConfig = (): IDatabaseConfig => ({
  uri: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
