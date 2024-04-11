import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { LoggerModule } from 'nestjs-pino';
import { loggingModuleOptions } from './logging';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development', '.env.test'],
      load: config,
    }),
    LoggerModule.forRootAsync(loggingModuleOptions),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
