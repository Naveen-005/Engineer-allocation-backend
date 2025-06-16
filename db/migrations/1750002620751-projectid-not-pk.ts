import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectidNotPk1750002620751 implements MigrationInterface {
    name = 'ProjectidNotPk1750002620751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_445ffe450695337dde56ca41fdb"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_6df40f662de3a9bf9157979696e"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" DROP CONSTRAINT "FK_8bef9d1f068f9aff21c9b211afe"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "PK_d67986984da09db4b9998a42b6b"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_2a781b3f2de389d1c6ea41f48f5" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_2e247fa2c2c3b955d12e124c10e" FOREIGN KEY ("p_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" ADD CONSTRAINT "FK_8b11b28676793d40e1b56828b5e" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" DROP CONSTRAINT "FK_8b11b28676793d40e1b56828b5e"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_2e247fa2c2c3b955d12e124c10e"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_2a781b3f2de389d1c6ea41f48f5"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "PK_d67986984da09db4b9998a42b6b" PRIMARY KEY ("project_id", "id")`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" ADD CONSTRAINT "FK_8bef9d1f068f9aff21c9b211afe" FOREIGN KEY ("project_id", "project_id") REFERENCES "projects"("id","project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_6df40f662de3a9bf9157979696e" FOREIGN KEY ("p_id", "p_id") REFERENCES "projects"("id","project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_445ffe450695337dde56ca41fdb" FOREIGN KEY ("project_id", "project_id") REFERENCES "projects"("id","project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
