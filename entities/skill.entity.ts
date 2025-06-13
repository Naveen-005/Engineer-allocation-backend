import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserSkill } from './userSkill.entity';
import { ProjectEngineerRequirementSkill } from './projectEngineerRequirementSkill.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  skill_id: number;

  @Column({ unique: true })
  skill_name: string;

  @OneToMany(() => UserSkill, us => us.skill)
  userSkills: UserSkill[];

  @OneToMany(() => ProjectEngineerRequirementSkill, rs => rs.skill)
  requirementSkills: ProjectEngineerRequirementSkill[];
}
