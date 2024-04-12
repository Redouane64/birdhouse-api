import {
  Global,
  Inject,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(Pool) private readonly pool: Pool) {}

  async onModuleInit() {
    await this.pool.connect();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
