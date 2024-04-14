import { registerAs } from '@nestjs/config';
import { appConfig } from './app-config';
import { databaseConfig } from './database-config';
import { authConfig } from './auth-config';

export default [
  registerAs('app', appConfig),
  registerAs('database', databaseConfig),
  registerAs('auth', authConfig),
];

export * from './app-config';
