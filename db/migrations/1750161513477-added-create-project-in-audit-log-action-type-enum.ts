import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCreateProjectInAuditLogActionTypeEnum1750161513477 implements MigrationInterface {
    name = 'AddedCreateProjectInAuditLogActionTypeEnum1750161513477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" DROP CONSTRAINT "FK_project_engineer_requirement_skills_requirement_id"`);
        await queryRunner.query(`ALTER TYPE "public"."audit_logs_action_type_enum" RENAME TO "audit_logs_action_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."audit_logs_action_type_enum" AS ENUM('ASSIGN_USER', 'REMOVE_USER', 'CREATE_PROJECT', 'UPDATE_PROJECT', 'CLOSE_PROJECT', 'UPDATE_SKILLSET', 'ADD_NOTE', 'REMOVE_NOTE')`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "action_type" TYPE "public"."audit_logs_action_type_enum" USING "action_type"::"text"::"public"."audit_logs_action_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."audit_logs_action_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."audit_logs_action_type_enum_old" AS ENUM('ASSIGN_USER', 'REMOVE_USER', 'UPDATE_PROJECT', 'CLOSE_PROJECT', 'UPDATE_SKILLSET', 'ADD_NOTE', 'REMOVE_NOTE')`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ALTER COLUMN "action_type" TYPE "public"."audit_logs_action_type_enum_old" USING "action_type"::"text"::"public"."audit_logs_action_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."audit_logs_action_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."audit_logs_action_type_enum_old" RENAME TO "audit_logs_action_type_enum"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" ADD CONSTRAINT "FK_project_engineer_requirement_skills_requirement_id" FOREIGN KEY ("requirement_id") REFERENCES "project_engineer_requirements"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
