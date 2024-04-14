import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1713094254227 implements MigrationInterface {
  name = 'InitialMigration1713094254227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "birdhouses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ubid" uuid NOT NULL, "name" character varying(16) NOT NULL, "longitude" double precision NOT NULL, "latitude" double precision NOT NULL, CONSTRAINT "idx_birdhouses_ubid" UNIQUE ("ubid"), CONSTRAINT "PK_8f52c24c55546befbe1ecdb1896" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "occupancy_history" ("id" SERIAL NOT NULL, "birds" integer NOT NULL DEFAULT '0', "eggs" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "ubid" uuid, CONSTRAINT "PK_a23f94838222030ff8822b83acb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "occupancy_history" ADD CONSTRAINT "fk_birdhouse_occupancy_history_ubid" FOREIGN KEY ("ubid") REFERENCES "birdhouses"("ubid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "occupancy_history" DROP CONSTRAINT "fk_birdhouse_occupancy_history_ubid"`,
    );
    await queryRunner.query(`DROP TABLE "occupancy_history"`);
    await queryRunner.query(`DROP TABLE "birdhouses"`);
  }
}
