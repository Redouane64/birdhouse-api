import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { LoggerModule } from 'nestjs-pino';
import { loggingModuleOptions } from './logging';
import { HousesModule } from './houses/houses.module';
import { RequestIdMiddleware } from './common/request-id.middleware';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development', '.env.test'],
      load: config,
    }),
    LoggerModule.forRootAsync(loggingModuleOptions),
    HousesModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
