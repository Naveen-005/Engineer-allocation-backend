import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjectEngineerRequirementSkill } from './projectEntities/projectEngineerRequirementSkill.entity';
import { UserSkill } from './userEntities/userSkill.entity';
import AbstractEntity from './abstract.entity';


@Entity('skills')
export class Skill extends AbstractEntity {
  @PrimaryGeneratedColumn()
  skill_id: number;

  @Column({ unique: true })
  skill_name: string;

  @OneToMany(() => UserSkill, us => us.skill)
  userSkills: UserSkill[];

  @OneToMany(() => ProjectEngineerRequirementSkill, rs => rs.skill)
  requirementSkills: ProjectEngineerRequirementSkill[];
}
