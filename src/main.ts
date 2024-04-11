import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app-config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger();
  const appConfig = configService.get<AppConfig>('app');
  await app.listen(appConfig.port, appConfig.host);
  logger.log(`app is listening on ${await app.getUrl()}`);
}
bootstrap();
