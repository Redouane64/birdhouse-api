import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './database-config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { BirdhouseEntity } from '../birdhouse/entities/birdhouse.entity';
import { BirdhouseOccupancyEntity } from '../birdhouse/entities/birdhouse-occupancy.entity';
import { AppConfig } from './app-config';

export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const appConfig = configService.get<AppConfig>('app');
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
      entities: [BirdhouseEntity, BirdhouseOccupancyEntity],
      logger: 'advanced-console',
      logging: appConfig.nodeEnv === 'test' ? false : 'all',
    };
  },
};
