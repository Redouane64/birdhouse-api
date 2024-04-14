import { registerAs } from '@nestjs/config';
import { appConfig } from './app-config';
import { databaseConfig } from './database-config';
import { authConfig } from './auth-config';
import { jobsConfig } from './jobs-config';

export default [
  registerAs('app', appConfig),
  registerAs('database', databaseConfig),
  registerAs('auth', authConfig),
  registerAs('jobs', jobsConfig),
];

export * from './app-config';
