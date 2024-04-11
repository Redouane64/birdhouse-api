import { ConfigFactory } from '@nestjs/config';
import * as Joi from 'joi';

const environments = ['development', 'test', 'production'] as const;

export interface AppConfig {
  nodeEnv: (typeof environments)[number];
  host: string;
  port: string;
}

export const appConfig: ConfigFactory<AppConfig> = () => {
  const config: AppConfig = {
    nodeEnv: process.env.NODE_ENV,
    host: process.env.HOST,
    port: process.env.PORT,
  };

  const configSchema = Joi.object<AppConfig>({
    nodeEnv: Joi.valid(...environments),
    host: Joi.string().optional().default('0.0.0.0'),
    port: Joi.number().required(),
  });

  const result = configSchema.validate(config);
  if (result.error) {
    throw result.error;
  }

  return result.value;
};
