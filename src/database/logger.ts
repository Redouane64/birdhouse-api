import { Logger } from '@nestjs/common';
import { Logger as TypeOrmLogger } from 'typeorm';

export class DatabaseLogger implements TypeOrmLogger {
  private readonly logger = new Logger(DatabaseLogger.name);

  logQuery(query: string, parameters?: any[] /*, queryRunner?: QueryRunner */) {
    this.logger.log(query, parameters);
  }
  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    /* queryRunner?: QueryRunner, */
  ) {
    this.logger.error(query, parameters);
  }
  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    /* queryRunner?: QueryRunner, */
  ) {
    this.logger.warn(query, parameters);
  }
  logSchemaBuild(message: string /*, queryRunner?: QueryRunner */) {
    this.logger.verbose(message);
  }
  logMigration(message: string /*, queryRunner?: QueryRunner */) {
    this.logger.verbose(message);
  }
  log(
    level: 'log' | 'warn' | 'info',
    message: any /*, queryRunner?: QueryRunner */,
  ) {
    if (level == 'log') this.logger.log(message);
    if (level == 'warn') this.logger.warn(message);
    if (level == 'info') this.logger.log(message);
  }
}
