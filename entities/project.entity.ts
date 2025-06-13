import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ProjectUser } from './projectUser.entity';
import { Note } from './note.entity';
import { ProjectEngineerRequirement } from './projectEngineerRequirement.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  project_id: number;

  @Column()
  name: string;

  @Column({ type: 'date', nullable: true })
  startdate: Date;

  @Column({ type: 'date', nullable: true })
  enddate: Date;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => User, user => user.managedProjects)
  @JoinColumn({ name: 'pmId' })
  pm: User;

  @ManyToOne(() => User, user => user.leadProjects)
  @JoinColumn({ name: 'leadID' })
  lead: User;

  @OneToMany(() => ProjectUser, pu => pu.project)
  projectUsers: ProjectUser[];

  @OneToMany(() => Note, note => note.project)
  notes: Note[];

  @OneToMany(() => ProjectEngineerRequirement, r => r.project)
  requirements: ProjectEngineerRequirement[];
}
