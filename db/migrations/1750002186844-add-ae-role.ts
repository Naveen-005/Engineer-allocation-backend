import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAeRole1750002186844 implements MigrationInterface {
    name = 'AddAeRole1750002186844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_7f1c99ef1db45b05ebc134d0b66"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_56aa8b049773aaf8bc7b3ecedc0"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_23fa71a4fa1ddafffbad8aa2151"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "user_designation" DROP CONSTRAINT "FK_d063a0b79c387265d8a4d0998ad"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "PK_09f4c8130b54f35925588a37b6a"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "PK_0461811633723388aadb0ac1740" PRIMARY KEY ("role_id", "id")`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_0ed310814bbf46ea421ba341901"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_e376a33a7ef5ae8911a43a53de7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_fb4f36ea1972cf584e841ee8343" FOREIGN KEY ("pmId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_646afe752c665e1b454a6e0dcc0" FOREIGN KEY ("leadId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_35b89a50cb9203dccff44136519" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_6926002c360291df66bb2c5fdeb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c0aabde4dd018e59eb5fd61cac4" FOREIGN KEY ("role_id", "role_id") REFERENCES "roles"("id","role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD CONSTRAINT "FK_566da490ab17096fd056c7122a4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_designation" DROP CONSTRAINT "FK_566da490ab17096fd056c7122a4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c0aabde4dd018e59eb5fd61cac4"`);
        await queryRunner.query(`ALTER TABLE "user_skills" DROP CONSTRAINT "FK_6926002c360291df66bb2c5fdeb"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_35b89a50cb9203dccff44136519"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_646afe752c665e1b454a6e0dcc0"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_fb4f36ea1972cf584e841ee8343"`);
        await queryRunner.query(`ALTER TABLE "project_user" DROP CONSTRAINT "FK_e376a33a7ef5ae8911a43a53de7"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_0ed310814bbf46ea421ba341901" PRIMARY KEY ("user_id", "id")`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "PK_0461811633723388aadb0ac1740"`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "PK_09f4c8130b54f35925588a37b6a" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_designation" ADD CONSTRAINT "FK_d063a0b79c387265d8a4d0998ad" FOREIGN KEY ("user_id", "user_id") REFERENCES "users"("id","user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skills" ADD CONSTRAINT "FK_23fa71a4fa1ddafffbad8aa2151" FOREIGN KEY ("user_id", "user_id") REFERENCES "users"("id","user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_56aa8b049773aaf8bc7b3ecedc0" FOREIGN KEY ("author_id", "author_id") REFERENCES "users"("id","user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_user" ADD CONSTRAINT "FK_7f1c99ef1db45b05ebc134d0b66" FOREIGN KEY ("user_id", "user_id") REFERENCES "users"("id","user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
