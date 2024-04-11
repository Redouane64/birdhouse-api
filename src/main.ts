import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app-config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(await app.resolve(PinoLogger));
  app.flushLogs();

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: appConfig.nodeEnv === 'development',
    }),
  );

  await app.listen(appConfig.port, appConfig.host);

  Logger.log(`app is listening on ${await app.getUrl()}`, bootstrap.name);
}
bootstrap();
