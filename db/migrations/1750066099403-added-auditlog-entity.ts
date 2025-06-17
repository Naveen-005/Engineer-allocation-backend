import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedAuditlogEntity1750066099403 implements MigrationInterface {
    name = 'AddedAuditlogEntity1750066099403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."audit_logs_action_type_enum" AS ENUM('ASSIGN_USER', 'REMOVE_USER', 'UPDATE_PROJECT', 'CLOSE_PROJECT', 'UPDATE_SKILLSET', 'ADD_NOTE', 'REMOVE_NOTE')`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" SERIAL NOT NULL, "actor_user_id" integer NOT NULL, "action_type" "public"."audit_logs_action_type_enum" NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "change_summary" text, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_f160d97a931844109de9d04228f" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_f160d97a931844109de9d04228f"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TYPE "public"."audit_logs_action_type_enum"`);
    }

}
