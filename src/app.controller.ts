import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async get() {
    const appConfig = this.configService.get<AppConfig>('app');

    // verify database connection readiness by querying database time
    const [{ time }] = await this.dataSource.query('SELECT now() AS time');

    return {
      ready: true,
      environment: appConfig.nodeEnv,
      db: { ready: !!time, time },
    };
  }
}
