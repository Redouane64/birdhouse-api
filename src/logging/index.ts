import { LoggerModuleAsyncParams, Params } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import pino from 'pino';

export const loggingModuleOptions: LoggerModuleAsyncParams = {
  inject: [
    /* ConfigService */
  ],
  useFactory: (/* configService: ConfigService */): Params => {
    const targets: pino.TransportTargetOptions<Record<string, any>>[] = [
      {
        target: 'pino-pretty',
        level: 'debug',
        options: {
          colorize: true,
        },
      },
    ];

    return {
      exclude: ['/healthz', '/favicon.ico'],
      pinoHttp: {
        transport: {
          targets,
        },
        // genReqId: () => randomUUID(),
      },
    };
  },
};
