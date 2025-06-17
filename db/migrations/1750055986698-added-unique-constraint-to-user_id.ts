import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUniqueConstraintToUserId1750055986698 implements MigrationInterface {
    name = 'AddedUniqueConstraintToUserId1750055986698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_96aac72f1574b88752e9fb00089" UNIQUE ("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_96aac72f1574b88752e9fb00089"`);
    }

}
