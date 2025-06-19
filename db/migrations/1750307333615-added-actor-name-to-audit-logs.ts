import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedActorNameToAuditLogs1750307333615 implements MigrationInterface {
    name = 'AddedActorNameToAuditLogs1750307333615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "actor_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "actor_name"`);
    }

}
