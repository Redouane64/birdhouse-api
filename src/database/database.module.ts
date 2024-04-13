import {
  Global,
  Inject,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config';

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(Pool) private readonly pool: Pool,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const appConfig = this.configService.get<AppConfig>('app');
    if (appConfig.nodeEnv !== 'test') {
      await this.pool.connect();
    }
  }

  async onModuleDestroy() {
    const appConfig = this.configService.get<AppConfig>('app');
    if (appConfig.nodeEnv !== 'test') {
      await this.pool.end();
    }
  }
}
