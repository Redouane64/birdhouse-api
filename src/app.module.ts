import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { LoggerModule } from 'nestjs-pino';
import { loggingModuleOptions } from './logging';
import { BirdhouseModule } from './birdhouse/birdhouse.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './config/typeorm-module.option';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development', '.env.test'],
      load: config,
    }),
    LoggerModule.forRootAsync(loggingModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    ScheduleModule.forRoot(),
    BirdhouseModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
