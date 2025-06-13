import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserDesignation } from './userDesignation.entity';
import { ProjectEngineerRequirementSkill } from './projectEngineerRequirement.entity';

@Entity('designation')
export class Designation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => UserDesignation, ud => ud.designation)
  userDesignations: UserDesignation[];

  @OneToMany(() => ProjectEngineerRequirement, r => r.designation)
  requirements: ProjectEngineerRequirementSkill[];
}
