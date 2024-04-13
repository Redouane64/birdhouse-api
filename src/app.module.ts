import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { LoggerModule } from 'nestjs-pino';
import { loggingModuleOptions } from './logging';
import { BirdhousesModule } from './birdhouses/birdhouses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormModuleOptions } from './config/typeorm-module.option';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development', '.env.test'],
      load: config,
    }),
    LoggerModule.forRootAsync(loggingModuleOptions),
    TypeOrmModule.forRootAsync(typeormModuleOptions),
    BirdhousesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
