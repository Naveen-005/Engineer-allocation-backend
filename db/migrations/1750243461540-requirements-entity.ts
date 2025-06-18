import { MigrationInterface, QueryRunner } from "typeorm";

export class RequirementsEntity1750243461540 implements MigrationInterface {
    name = 'RequirementsEntity1750243461540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_7d84583a99e64034151c36fcee2"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP COLUMN "designation_id"`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD "requirement_id" integer`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_f160d97a931844109de9d04228f"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "actor_user_id"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "actor_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_a2a2c24088cf5e9684ed2cc2e13" FOREIGN KEY ("requirement_id") REFERENCES "project_engineer_requirements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_f160d97a931844109de9d04228f" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_f160d97a931844109de9d04228f"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_a2a2c24088cf5e9684ed2cc2e13"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "actor_user_id"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "actor_user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_f160d97a931844109de9d04228f" FOREIGN KEY ("actor_user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_user" RENAME COLUMN "requirement_id" TO "designation_id"`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_7d84583a99e64034151c36fcee2" FOREIGN KEY ("designation_id") REFERENCES "designation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
