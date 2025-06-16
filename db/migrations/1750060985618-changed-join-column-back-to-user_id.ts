import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedJoinColumnBackToUserId1750060985618 implements MigrationInterface {
    name = 'ChangedJoinColumnBackToUserId1750060985618'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_designation" DROP CONSTRAINT "FK_b562051ee1314f5627caf10c2f6"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_4d0a72117fbf387752dbc8506af"`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD CONSTRAINT "FK_566da490ab17096fd056c7122a4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_6926002c360291df66bb2c5fdeb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_6926002c360291df66bb2c5fdeb"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP CONSTRAINT "FK_566da490ab17096fd056c7122a4"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_4d0a72117fbf387752dbc8506af" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD CONSTRAINT "FK_b562051ee1314f5627caf10c2f6" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
