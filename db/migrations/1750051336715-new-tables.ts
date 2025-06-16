import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTables1750051336715 implements MigrationInterface {
    name = 'NewTables1750051336715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "role_id" SERIAL NOT NULL, "role_name" character varying NOT NULL, CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039" UNIQUE ("role_name"), CONSTRAINT "PK_0461811633723388aadb0ac1740" PRIMARY KEY ("id", "role_id"))`);
        await queryRunner.query(`CREATE TABLE "project_user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_shadow" boolean NOT NULL DEFAULT false, "assigned_on" date, "end_date" date, "project_id" integer, "user_id" integer, CONSTRAINT "PK_1cf56b10b23971cfd07e4fc6126" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "project_id" character varying NOT NULL, "name" character varying NOT NULL, "startdate" date, "enddate" date, "status" character varying, "pmId" integer, "leadId" integer, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "content" text NOT NULL, "p_id" integer, "author_id" integer, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_skills" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, "skill_id" integer, CONSTRAINT "PK_4d0a72117fbf387752dbc8506af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "joined_at" date, "experience" integer, "role_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_designation" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" integer, "designation_id" integer, CONSTRAINT "PK_b562051ee1314f5627caf10c2f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "designation" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "UQ_b7573ddcc5fc62bb50e1ce4b7c5" UNIQUE ("name"), CONSTRAINT "PK_8c84a3c335a852ff2d426cb0112" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_engineer_requirements" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "required_count" integer NOT NULL, "is_requested" boolean NOT NULL DEFAULT false, "project_id" integer, "designation_id" integer, CONSTRAINT "PK_754f7a0c2fc7dc2c7ab10275014" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_engineer_requirement_skills" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "requirement_id" integer, "skill_id" integer, CONSTRAINT "PK_ee67487caf861aaa0fc440bc186" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skills" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "skill_id" SERIAL NOT NULL, "skill_name" character varying NOT NULL, CONSTRAINT "UQ_6c500b27556245e209296e8a3fe" UNIQUE ("skill_name"), CONSTRAINT "PK_f8f2c50c5db753b8f452bf1491a" PRIMARY KEY ("id", "skill_id"))`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_2a781b3f2de389d1c6ea41f48f5" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_e376a33a7ef5ae8911a43a53de7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_fb4f36ea1972cf584e841ee8343" FOREIGN KEY ("pmId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_646afe752c665e1b454a6e0dcc0" FOREIGN KEY ("leadId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_2e247fa2c2c3b955d12e124c10e" FOREIGN KEY ("p_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_35b89a50cb9203dccff44136519" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_6926002c360291df66bb2c5fdeb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_bc98903810b21e6124e07974bc7" FOREIGN KEY ("skill_id", "skill_id") REFERENCES "skills"("id","skill_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c0aabde4dd018e59eb5fd61cac4" FOREIGN KEY ("role_id", "role_id") REFERENCES "roles"("id","role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD CONSTRAINT "FK_566da490ab17096fd056c7122a4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD CONSTRAINT "FK_da2cf0847854a7db8dccb98481e" FOREIGN KEY ("designation_id") REFERENCES "designation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" ADD CONSTRAINT "FK_8b11b28676793d40e1b56828b5e" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" ADD CONSTRAINT "FK_b4ce5de48cc354bf07985e66952" FOREIGN KEY ("designation_id") REFERENCES "designation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" ADD CONSTRAINT "FK_e123442ebb95f18d9fe4bfe6439" FOREIGN KEY ("requirement_id") REFERENCES "project_engineer_requirements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" ADD CONSTRAINT "FK_1ae1b5b2a9c4c6ae56c82ad508d" FOREIGN KEY ("skill_id", "skill_id") REFERENCES "skills"("id","skill_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" DROP CONSTRAINT "FK_1ae1b5b2a9c4c6ae56c82ad508d"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" DROP CONSTRAINT "FK_e123442ebb95f18d9fe4bfe6439"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" DROP CONSTRAINT "FK_b4ce5de48cc354bf07985e66952"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" DROP CONSTRAINT "FK_8b11b28676793d40e1b56828b5e"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP CONSTRAINT "FK_da2cf0847854a7db8dccb98481e"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP CONSTRAINT "FK_566da490ab17096fd056c7122a4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c0aabde4dd018e59eb5fd61cac4"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_bc98903810b21e6124e07974bc7"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_6926002c360291df66bb2c5fdeb"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_35b89a50cb9203dccff44136519"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_2e247fa2c2c3b955d12e124c10e"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_646afe752c665e1b454a6e0dcc0"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_fb4f36ea1972cf584e841ee8343"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_e376a33a7ef5ae8911a43a53de7"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_2a781b3f2de389d1c6ea41f48f5"`);
        await queryRunner.query(`DROP TABLE "skills"`);
        await queryRunner.query(`DROP TABLE "project_engineer_requirement_skills"`);
        await queryRunner.query(`DROP TABLE "project_engineer_requirements"`);
        await queryRunner.query(`DROP TABLE "designation"`);
        await queryRunner.query(`DROP TABLE "user_designation"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_skills"`);
        await queryRunner.query(`DROP TABLE "notes"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "project_user"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
