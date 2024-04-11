import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  get() {
    const appConfig = this.configService.get<AppConfig>('app');
    return { ready: true, environment: appConfig.nodeEnv };
  }
}
