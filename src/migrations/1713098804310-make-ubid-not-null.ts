import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUbidNotNull1713098804310 implements MigrationInterface {
  name = 'MakeUbidNotNull1713098804310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "occupancy_history" DROP CONSTRAINT "fk_birdhouse_occupancy_history_ubid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "occupancy_history" ALTER COLUMN "ubid" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "occupancy_history" ADD CONSTRAINT "fk_birdhouse_occupancy_history_ubid" FOREIGN KEY ("ubid") REFERENCES "birdhouses"("ubid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "occupancy_history" DROP CONSTRAINT "fk_birdhouse_occupancy_history_ubid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "occupancy_history" ALTER COLUMN "ubid" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "occupancy_history" ADD CONSTRAINT "fk_birdhouse_occupancy_history_ubid" FOREIGN KEY ("ubid") REFERENCES "birdhouses"("ubid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
