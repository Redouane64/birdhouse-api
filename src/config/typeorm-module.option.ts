import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './database-config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeormModuleOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const { host, port, database, username, password } =
      configService.get<DatabaseConfig>('database');
    return {
      type: 'postgres',
      host,
      port,
      database,
      username,
      password,
      applicationName: 'birdhouse-api',
    };
  },
};
