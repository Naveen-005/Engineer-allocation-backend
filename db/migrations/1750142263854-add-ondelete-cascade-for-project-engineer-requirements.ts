import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOndeleteCascadeForProjectEngineerRequirements1750142263854
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "project_engineer_requirement_skills" DROP CONSTRAINT IF EXISTS "FK_project_engineer_requirement_skills_requirement_id";
          ALTER TABLE "project_engineer_requirement_skills"
          ADD CONSTRAINT "FK_project_engineer_requirement_skills_requirement_id"
          FOREIGN KEY ("requirement_id") REFERENCES "project_engineer_requirements"("id") ON DELETE CASCADE;
        `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE "project_engineer_requirement_skills" DROP CONSTRAINT IF EXISTS "FK_project_engineer_requirement_skills_requirement_id";
          ALTER TABLE "project_engineer_requirement_skills"
          ADD CONSTRAINT "FK_project_engineer_requirement_skills_requirement_id"
          FOREIGN KEY ("requirement_id") REFERENCES "project_engineer_requirements"("id");
        `);
  }
}
