import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';
import { Pool } from 'pg';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly pool: Pool,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async get() {
    const appConfig = this.configService.get<AppConfig>('app');

    // verify database connection readiness by querying database time
    const {
      rows: [row],
    } = await this.pool.query('SELECT now() AS time');

    return {
      ready: true,
      environment: appConfig.nodeEnv,
      db: { ready: !!row, time: row.time },
    };
  }
}
