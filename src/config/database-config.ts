import { ConfigFactory } from '@nestjs/config';
import * as Joi from 'joi';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const databaseConfig: ConfigFactory<DatabaseConfig> = () => {
  const config: DatabaseConfig = {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  };

  const configSchema = Joi.object<DatabaseConfig>({
    host: Joi.string().required(),
    port: Joi.number().required(),
    database: Joi.string().required(),
    username: Joi.optional(),
    password: Joi.optional(),
  });

  const result = configSchema.validate(config);
  if (result.error) {
    throw result.error;
  }

  return result.value;
};
