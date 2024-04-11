import { ConfigService } from '@nestjs/config';
import { LoggerModuleAsyncParams, Params } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import pino from 'pino';
import { AppConfig } from '../config';

export const loggingModuleOptions: LoggerModuleAsyncParams = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Params => {
    const targets: pino.TransportTargetOptions<Record<string, any>>[] = [];
    const appConfig = configService.get<AppConfig>('app');
    if (appConfig.nodeEnv !== 'test') {
      targets.push({
        target: 'pino-pretty',
        level: 'debug',
        options: {
          colorize: true,
        },
      });
    }

    return {
      exclude: ['/healthz', '/favicon.ico'],
      pinoHttp: {
        transport: {
          targets,
        },
        genReqId: () => randomUUID(),
      },
    };
  },
};
