import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ProjectEngineerRequirement } from "./projectEngineerRequirement.entity";
import { Skill } from "../skill.entity";
import AbstractEntity from "../abstract.entity";

@Entity("project_engineer_requirement_skills")
export class ProjectEngineerRequirementSkill extends AbstractEntity {
  constructor(requirement?: ProjectEngineerRequirement, skill?: Skill) {
    super();
    if (requirement) this.requirement = requirement;
    if (skill) this.skill = skill;
  }

  @ManyToOne(() => ProjectEngineerRequirement, (r) => r.requirementSkills)
  @JoinColumn({ name: "requirement_id" })
  requirement: ProjectEngineerRequirement;

  @ManyToOne(() => Skill, (s) => s.requirementSkills, { eager: true })
  @JoinColumn({ name: "skill_id" })
  skill: Skill;
}
