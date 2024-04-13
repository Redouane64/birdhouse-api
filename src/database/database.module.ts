import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { Pool } from 'pg';

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(Pool) private readonly pool: Pool) {}

  async onModuleDestroy() {
    await this.pool.end();
  }
}
