import { MigrationInterface, QueryRunner } from "typeorm";

export class AuditLogUserIdTypeToString1750225300999 implements MigrationInterface {
    name = 'AuditLogUserIdTypeToString1750225300999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_f160d97a931844109de9d04228f"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "actor_user_id"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "actor_user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_f160d97a931844109de9d04228f" FOREIGN KEY ("actor_user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_f160d97a931844109de9d04228f"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "actor_user_id"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "actor_user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_f160d97a931844109de9d04228f" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
