import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity('project_user')
export class ProjectUser {
  @PrimaryGeneratedColumn()
  id: number;

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
