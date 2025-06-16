import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedNoteEntity1749988200963 implements MigrationInterface {
    name = 'UpdatedNoteEntity1749988200963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "PK_5f631b0db14a27e3bcd91f83050"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "noteid"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "noteid" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "PK_5f631b0db14a27e3bcd91f83050" PRIMARY KEY ("noteid")`);
    }

}
