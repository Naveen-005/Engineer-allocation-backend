import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from '../abstract.entity';
import { Project } from './project.entity';
import { User } from '../userEntities/user.entity';

@Entity('project_user')
export class ProjectUser extends AbstractEntity {
  constructor(
    project?: Project,
    user?: User,
    is_shadow: boolean = false,
    assigned_on?: Date,
    end_date?: Date,
    designation_id?: number
  ) {
    super();
    if (project) this.project = project;
    if (user) this.user = user;
    this.is_shadow = is_shadow;
    if (assigned_on) this.assigned_on = assigned_on;
    if (end_date) this.end_date = end_date;
  }

  @ManyToOne(() => Project, project => project.projectUsers)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, user => user.projectUsers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: false })
  is_shadow: boolean;

  @Column({ type: 'date', nullable: true })
  assigned_on: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;
}
