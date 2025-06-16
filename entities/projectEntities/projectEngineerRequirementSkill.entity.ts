import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectEngineerRequirement } from './projectEngineerRequirement.entity';
import { Skill } from '../skill.entity';

@Entity('project_engineer_requirement_skills')
export class ProjectEngineerRequirementSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProjectEngineerRequirement, r => r.requirementSkills)
  @JoinColumn({ name: 'requirement_id' })
  requirement: ProjectEngineerRequirement;

  @ManyToOne(() => Skill, s => s.requirementSkills)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;
}