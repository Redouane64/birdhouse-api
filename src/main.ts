import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app-config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';
import dataSource from './database/data-source';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  await dataSource.initialize();
  Logger.log(`Running database migrations...`);
  await dataSource.runMigrations();
  Logger.log(`Migrations ran successfully`);
  await dataSource.destroy();

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(await app.resolve(PinoLogger));
  app.flushLogs();

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Birdhouse API')
    .setDescription('Birdhouse protocol API')
    .setVersion('1.0')
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(appConfig.port, appConfig.host);

  Logger.log(`app is listening on ${await app.getUrl()}`, bootstrap.name);
}
bootstrap();
