import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUbidCreatedAtDescCompositeIndex1713096505551
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "idx_birdhouse_history_ubid_created_at" ON "occupancy_history" ("ubid", "created_at" DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP  INDEX "idx_birdhouse_history_ubid_created_at"`,
    );
  }
}
