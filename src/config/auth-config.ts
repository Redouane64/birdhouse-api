import { ConfigFactory } from '@nestjs/config';
import * as Joi from 'joi';

export interface AuthConfig {
  username: string;
  password: string;
}

export const authConfig: ConfigFactory<AuthConfig> = () => {
  const config: AuthConfig = {
    username: process.env.SEED_AUTH_USERNAME,
    password: process.env.SEED_AUTH_PASSWORD,
  };

  const configSchema = Joi.object<AuthConfig>({
    username: Joi.required(),
    password: Joi.required(),
  });

  const result = configSchema.validate(config);
  if (result.error) {
    throw result.error;
  }

  return result.value;
};
