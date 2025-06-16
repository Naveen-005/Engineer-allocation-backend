import { MigrationInterface, QueryRunner } from "typeorm";

export class RenderTest1749974783948 implements MigrationInterface {
    name = 'RenderTest1749974783948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("role_id" SERIAL NOT NULL, "role_name" character varying NOT NULL, CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039" UNIQUE ("role_name"), CONSTRAINT "PK_09f4c8130b54f35925588a37b6a" PRIMARY KEY ("role_id"))`);
        await queryRunner.query(`CREATE TABLE "project_user" ("id" SERIAL NOT NULL, "is_shadow" boolean NOT NULL DEFAULT false, "assigned_on" date, "end_date" date, "project_id" integer, "user_id" integer, CONSTRAINT "PK_1cf56b10b23971cfd07e4fc6126" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notes" ("noteid" SERIAL NOT NULL, "content" text NOT NULL, "p_id" integer, "author_id" integer, CONSTRAINT "PK_5f631b0db14a27e3bcd91f83050" PRIMARY KEY ("noteid"))`);
        await queryRunner.query(`CREATE TABLE "user_designation" ("id" SERIAL NOT NULL, "user_id" integer, "designation_id" integer, CONSTRAINT "PK_b562051ee1314f5627caf10c2f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "designation" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_b7573ddcc5fc62bb50e1ce4b7c5" UNIQUE ("name"), CONSTRAINT "PK_8c84a3c335a852ff2d426cb0112" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skills" ("skill_id" SERIAL NOT NULL, "skill_name" character varying NOT NULL, CONSTRAINT "UQ_6c500b27556245e209296e8a3fe" UNIQUE ("skill_name"), CONSTRAINT "PK_55ac384c23eb7bf7a8929836317" PRIMARY KEY ("skill_id"))`);
        await queryRunner.query(`CREATE TABLE "project_engineer_requirement_skills" ("id" SERIAL NOT NULL, "requirement_id" integer, "skill_id" integer, CONSTRAINT "PK_ee67487caf861aaa0fc440bc186" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_engineer_requirements" ("id" SERIAL NOT NULL, "required_count" integer NOT NULL, "is_requested" boolean NOT NULL DEFAULT false, "project_id" integer, "designation_id" integer, CONSTRAINT "PK_754f7a0c2fc7dc2c7ab10275014" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("project_id" SERIAL NOT NULL, "name" character varying NOT NULL, "startdate" date, "enddate" date, "status" character varying, "pmId" integer, "leadID" integer, CONSTRAINT "PK_b3613537a59b41f5811258edf99" PRIMARY KEY ("project_id"))`);
        await queryRunner.query(`CREATE TABLE "user_skills" ("id" SERIAL NOT NULL, "user_id" integer, "skill_id" integer, CONSTRAINT "PK_4d0a72117fbf387752dbc8506af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_pkey"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "joined_at" date`);
        await queryRunner.query(`ALTER TABLE "users" ADD "experience" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_email_key"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_2a781b3f2de389d1c6ea41f48f5" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_e376a33a7ef5ae8911a43a53de7" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_2e247fa2c2c3b955d12e124c10e" FOREIGN KEY ("p_id") REFERENCES "projects"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_35b89a50cb9203dccff44136519" FOREIGN KEY ("author_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD CONSTRAINT "FK_566da490ab17096fd056c7122a4" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD CONSTRAINT "FK_da2cf0847854a7db8dccb98481e" FOREIGN KEY ("designation_id") REFERENCES "designation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" ADD CONSTRAINT "FK_e123442ebb95f18d9fe4bfe6439" FOREIGN KEY ("requirement_id") REFERENCES "project_engineer_requirements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" ADD CONSTRAINT "FK_7a338a012990ef17f626d3a77e4" FOREIGN KEY ("skill_id") REFERENCES "skills"("skill_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" ADD CONSTRAINT "FK_8b11b28676793d40e1b56828b5e" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" ADD CONSTRAINT "FK_b4ce5de48cc354bf07985e66952" FOREIGN KEY ("designation_id") REFERENCES "designation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_fb4f36ea1972cf584e841ee8343" FOREIGN KEY ("pmId") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_88e55f9a204aaa654e0bc70cfcb" FOREIGN KEY ("leadID") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_6926002c360291df66bb2c5fdeb" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_eb69710b0a00f42fb95fc2ac2f5" FOREIGN KEY ("skill_id") REFERENCES "skills"("skill_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_eb69710b0a00f42fb95fc2ac2f5"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_6926002c360291df66bb2c5fdeb"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_88e55f9a204aaa654e0bc70cfcb"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_fb4f36ea1972cf584e841ee8343"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" DROP CONSTRAINT "FK_b4ce5de48cc354bf07985e66952"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirements" DROP CONSTRAINT "FK_8b11b28676793d40e1b56828b5e"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" DROP CONSTRAINT "FK_7a338a012990ef17f626d3a77e4"`);
        await queryRunner.query(`ALTER TABLE "project_engineer_requirement_skills" DROP CONSTRAINT "FK_e123442ebb95f18d9fe4bfe6439"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP CONSTRAINT "FK_da2cf0847854a7db8dccb98481e"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP CONSTRAINT "FK_566da490ab17096fd056c7122a4"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_35b89a50cb9203dccff44136519"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_2e247fa2c2c3b955d12e124c10e"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_e376a33a7ef5ae8911a43a53de7"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_2a781b3f2de389d1c6ea41f48f5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "experience"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "joined_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_96aac72f1574b88752e9fb00089"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "user_skills"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "project_engineer_requirements"`);
        await queryRunner.query(`DROP TABLE "project_engineer_requirement_skills"`);
        await queryRunner.query(`DROP TABLE "skills"`);
        await queryRunner.query(`DROP TABLE "designation"`);
        await queryRunner.query(`DROP TABLE "user_designation"`);
        await queryRunner.query(`DROP TABLE "notes"`);
        await queryRunner.query(`DROP TABLE "project_user"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
