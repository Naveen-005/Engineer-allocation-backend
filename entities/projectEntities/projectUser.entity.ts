import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from '../abstract.entity';
import { Project } from './project.entity';
import { User } from '../userEntities/user.entity';
import { Designation } from '../userEntities/designation.entity';
import { ProjectEngineerRequirement } from './projectEngineerRequirement.entity';

@Entity("project_user")
export class ProjectUser extends AbstractEntity {
  constructor(
    project?: Project,
    user?: User,
    is_shadow: boolean = false,
    assigned_on?: Date,
    end_date?: Date,
    requirement_id?: number
  ) {
    super();
    if (project) this.project = project;
    if (user) this.user = user;
    this.is_shadow = is_shadow;
    if (assigned_on) this.assigned_on = assigned_on;
    if (end_date) this.end_date = end_date;
    if (requirement_id) this.requirement_id = requirement_id;
  }

  @ManyToOne(() => Project, (project) => project.projectUsers)
  @JoinColumn({ name: "project_id" })
  project: Project;

  @ManyToOne(() => User, (user) => user.projectUsers)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ default: false })
  is_shadow: boolean;

  @Column({ type: "date", nullable: true })
  assigned_on: Date;

  @Column({ type: "date", nullable: true })
  end_date: Date;

  @ManyToOne(() => ProjectEngineerRequirement)
  @JoinColumn({ name: "requirement_id" })
  requirement: ProjectEngineerRequirement;

  @Column({ nullable: true })
  requirement_id: number;
}
