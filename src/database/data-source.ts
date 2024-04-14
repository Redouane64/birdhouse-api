import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV}` });

export default new DataSource({
  type: 'postgres',
  applicationName: 'birdhouse-api',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  migrationsTransactionMode: 'all',
  migrations: ['./dist/migrations/**/*.js'],
  entities: ['./dist/**/*.entity.js'],
  synchronize: false,
  logger: 'advanced-console',
  logging: 'all',
});
