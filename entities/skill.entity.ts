import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ProjectEngineerRequirementSkill } from "./projectEntities/projectEngineerRequirementSkill.entity";
import { UserSkill } from "./userEntities/userSkill.entity";
import AbstractEntity from "./abstract.entity";

@Entity("skills")
export class Skill extends AbstractEntity {
  constructor(skill_name?: string) {
    super();
    if (skill_name) this.skill_name = skill_name;
  }

  @PrimaryGeneratedColumn()
  skill_id: number;

  @Column({ unique: true })
  skill_name: string;

  @OneToMany(() => UserSkill, (us) => us.skill)
  userSkills: UserSkill[];

  @OneToMany(() => ProjectEngineerRequirementSkill, (rs) => rs.skill)
  requirementSkills: ProjectEngineerRequirementSkill[];
}
