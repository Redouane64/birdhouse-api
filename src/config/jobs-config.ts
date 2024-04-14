import { ConfigFactory } from '@nestjs/config';
import * as Joi from 'joi';

import { config } from 'dotenv';
config({ path: ['.env', '.env.development'] });

export interface JobsConfig {
  birdhousePruningPeriod: string;
}

export const jobsConfig: ConfigFactory<JobsConfig> = () => {
  const config: JobsConfig = {
    birdhousePruningPeriod: process.env.CRON_PRUNE_BIRDHOUSE_PERIOD,
  };

  const configSchema = Joi.object<JobsConfig>({
    birdhousePruningPeriod: Joi.required(),
  });

  const result = configSchema.validate(config);
  if (result.error) {
    throw result.error;
  }

  return result.value;
};
