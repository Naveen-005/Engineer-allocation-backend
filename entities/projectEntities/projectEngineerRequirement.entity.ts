import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Designation } from '../userEntities/designation.entity';
import { Project } from './project.entity';
import { ProjectEngineerRequirementSkill } from './projectEngineerRequirementSkill.entity';

@Entity('project_engineer_requirements')
export class ProjectEngineerRequirement {
    
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, p => p.requirements)
  @JoinColumn({name:'project_id'})
  project: ProjectEngineerRequirement;

  @ManyToOne(() => Designation, d => d.requirements)
  @JoinColumn({name:'designation_id'})
  designation: Designation;

  @Column()
  required_count: number;

  @Column({ default: false })
  is_requested: boolean;

  @OneToMany(() => ProjectEngineerRequirementSkill, rs => rs.requirement)
  requirementSkills: ProjectEngineerRequirementSkill[];
}
