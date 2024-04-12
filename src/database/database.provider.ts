import { Provider, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DatabaseConfig } from '../config/database-config';

export const databaseProvider: Provider<Pool> = {
  scope: Scope.DEFAULT,
  provide: Pool,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const { host, port, database, username, password } =
      configService.get<DatabaseConfig>('database');
    return new Pool({
      host,
      port,
      database,
      user: username,
      password,
      application_name: 'birdhouse-api',
    });
  },
};
