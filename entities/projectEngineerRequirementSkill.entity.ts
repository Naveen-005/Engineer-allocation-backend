import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Skill } from './skill.entity';
import { UserSkill } from './userSkill.entity';
import { ProjectEngineerRequirement } from './projectEngineerRequirement.entity';

@Entity('project_engineer_requirement_skills')
export class ProjectEngineerRequirementSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProjectEngineerRequirement, r => r.requirementSkills)
  @JoinColumn({ name: 'requirement_id' })
  requirement: ProjectEngineerRequirementSkill;

  @ManyToOne(() => Skill, s => s.requirementSkills)
  @JoinColumn({ name: 'skill_id' })
  skill: UserSkill;
}