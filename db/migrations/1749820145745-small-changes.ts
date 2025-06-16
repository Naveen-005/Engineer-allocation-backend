import { MigrationInterface, QueryRunner } from "typeorm";

export class SmallChanges1749820145745 implements MigrationInterface {
    name = 'SmallChanges1749820145745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_2a781b3f2de389d1c6ea41f48f5"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_e376a33a7ef5ae8911a43a53de7"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_fb4f36ea1972cf584e841ee8343"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_88e55f9a204aaa654e0bc70cfcb"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_2e247fa2c2c3b955d12e124c10e"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_35b89a50cb9203dccff44136519"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_6926002c360291df66bb2c5fdeb"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP CONSTRAINT "FK_566da490ab17096fd056c7122a4"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" DROP CONSTRAINT "FK_8b11b28676793d40e1b56828b5e"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "leadID"`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "PK_b3613537a59b41f5811258edf99"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "PK_d67986984da09db4b9998a42b6b" PRIMARY KEY ("project_id", "id")`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "leadId" integer`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_96aac72f1574b88752e9fb00089"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_0ed310814bbf46ea421ba341901" PRIMARY KEY ("user_id", "id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "designation" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "designation" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "designation" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "project_id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "projects_project_id_seq"`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_445ffe450695337dde56ca41fdb" FOREIGN KEY ("project_id", "project_id") REFERENCES "projects"("id","project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_7f1c99ef1db45b05ebc134d0b66" FOREIGN KEY ("user_id", "user_id") REFERENCES "users"("id","user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_4c52bb617714cbe6a994778e0b5" FOREIGN KEY ("pmId", "pmId") REFERENCES "users"("id","user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_f79ac75d33c05091e10d901e6d9" FOREIGN KEY ("leadId", "leadId") REFERENCES "users"("id","user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_6df40f662de3a9bf9157979696e" FOREIGN KEY ("p_id", "p_id") REFERENCES "projects"("id","project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_56aa8b049773aaf8bc7b3ecedc0" FOREIGN KEY ("author_id", "author_id") REFERENCES "users"("id","user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_23fa71a4fa1ddafffbad8aa2151" FOREIGN KEY ("user_id", "user_id") REFERENCES "users"("id","user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD CONSTRAINT "FK_d063a0b79c387265d8a4d0998ad" FOREIGN KEY ("user_id", "user_id") REFERENCES "users"("id","user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" ADD CONSTRAINT "FK_8bef9d1f068f9aff21c9b211afe" FOREIGN KEY ("project_id", "project_id") REFERENCES "projects"("id","project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" DROP CONSTRAINT "FK_8bef9d1f068f9aff21c9b211afe"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP CONSTRAINT "FK_d063a0b79c387265d8a4d0998ad"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_23fa71a4fa1ddafffbad8aa2151"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_56aa8b049773aaf8bc7b3ecedc0"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_6df40f662de3a9bf9157979696e"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_f79ac75d33c05091e10d901e6d9"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_4c52bb617714cbe6a994778e0b5"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_7f1c99ef1db45b05ebc134d0b66"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_445ffe450695337dde56ca41fdb"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "projects_project_id_seq" OWNED BY "projects"."project_id"`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "project_id" SET DEFAULT nextval('"projects_project_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "designation" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "designation" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "designation" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_0ed310814bbf46ea421ba341901"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "leadId"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "PK_d67986984da09db4b9998a42b6b"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "PK_b3613537a59b41f5811258edf99" PRIMARY KEY ("project_id")`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "leadID" integer`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" ADD CONSTRAINT "FK_8b11b28676793d40e1b56828b5e" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD CONSTRAINT "FK_566da490ab17096fd056c7122a4" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_6926002c360291df66bb2c5fdeb" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_35b89a50cb9203dccff44136519" FOREIGN KEY ("author_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_2e247fa2c2c3b955d12e124c10e" FOREIGN KEY ("p_id") REFERENCES "projects"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_88e55f9a204aaa654e0bc70cfcb" FOREIGN KEY ("leadID") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_fb4f36ea1972cf584e841ee8343" FOREIGN KEY ("pmId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_e376a33a7ef5ae8911a43a53de7" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_2a781b3f2de389d1c6ea41f48f5" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
