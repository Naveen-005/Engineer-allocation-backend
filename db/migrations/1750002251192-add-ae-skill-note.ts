import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAeSkillNote1750002251192 implements MigrationInterface {
    name = 'AddAeSkillNote1750002251192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_eb69710b0a00f42fb95fc2ac2f5"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" DROP CONSTRAINT "FK_7a338a012990ef17f626d3a77e4"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "PK_5f631b0db14a27e3bcd91f83050"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "PK_9fc6e224d6cf037c36f7d48d41d" PRIMARY KEY ("noteid", "id")`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notes" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "skills" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "skills" DROP CONSTRAINT "PK_55ac384c23eb7bf7a8929836317"`);
        await queryRunner.query(`ALTER TABLE "skills" ADD CONSTRAINT "PK_f8f2c50c5db753b8f452bf1491a" PRIMARY KEY ("skill_id", "id")`);
        await queryRunner.query(`ALTER TABLE "skills" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skills" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "skills" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_bc98903810b21e6124e07974bc7" FOREIGN KEY ("skill_id", "skill_id") REFERENCES "skills"("id","skill_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" ADD CONSTRAINT "FK_1ae1b5b2a9c4c6ae56c82ad508d" FOREIGN KEY ("skill_id", "skill_id") REFERENCES "skills"("id","skill_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" DROP CONSTRAINT "FK_1ae1b5b2a9c4c6ae56c82ad508d"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_bc98903810b21e6124e07974bc7"`);
        await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "skills" DROP CONSTRAINT "PK_f8f2c50c5db753b8f452bf1491a"`);
        await queryRunner.query(`ALTER TABLE "skills" ADD CONSTRAINT "PK_55ac384c23eb7bf7a8929836317" PRIMARY KEY ("skill_id")`);
        await queryRunner.query(`ALTER TABLE "skills" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "PK_9fc6e224d6cf037c36f7d48d41d"`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "PK_5f631b0db14a27e3bcd91f83050" PRIMARY KEY ("noteid")`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" ADD CONSTRAINT "FK_7a338a012990ef17f626d3a77e4" FOREIGN KEY ("skill_id") REFERENCES "skills"("skill_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_eb69710b0a00f42fb95fc2ac2f5" FOREIGN KEY ("skill_id") REFERENCES "skills"("skill_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
