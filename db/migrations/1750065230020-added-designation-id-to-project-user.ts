import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDesignationIdToProjectUser1750065230020 implements MigrationInterface {
    name = 'AddedDesignationIdToProjectUser1750065230020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_user" ADD "designation_id" integer`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_7d84583a99e64034151c36fcee2" FOREIGN KEY ("designation_id") REFERENCES "designation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_7d84583a99e64034151c36fcee2"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP COLUMN "designation_id"`);
    }

}
