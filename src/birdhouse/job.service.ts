import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config({ path: ['.env', '.env.development'] });

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(private readonly dataSource: DataSource) {}

  @Cron(
    process.env.CRON_PRUNE_BIRDHOUSE_PERIOD ||
      CronExpression.EVERY_DAY_AT_MIDNIGHT,
    {
      name: 'prune_birdhouses_job',
    },
  )
  async pruneBirdhouse() {
    this.logger.log(`pruning birdhouses older then a year`);

    // Get the current date one year ago
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // delete birdhouse that has 0 occupancy records newer than a year
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [rows, affected] = await this.dataSource.query(
      `DELETE FROM birdhouses
       WHERE NOT EXISTS (
        SELECT 1 FROM occupancy_history o
        WHERE birdhouses.ubid = o.ubid AND o.created_at > $1
       )
       RETURNING ubid`,
      [oneYearAgo],
    );

    this.logger.log(`pruning completed - ${affected} records deleted`);
  }
}
