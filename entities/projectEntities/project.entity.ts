import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../userEntities/user.entity';
import { Note } from '../note.entity';
import { ProjectEngineerRequirement } from './projectEngineerRequirement.entity';
import { ProjectUser } from './projectUser.entity';
import AbstractEntity from '../abstract.entity';

@Entity('projects')
export class Project extends AbstractEntity {

   constructor(
    project_id?: string,
    name?: string,
    startdate?: Date,
    enddate?: Date,
    status?: string,
    pm?: User,
    lead?: User
  ) {
    super();
    if (project_id !== undefined) this.project_id = project_id;
    if (name) this.name = name;
    if (startdate) this.startdate = startdate;
    if (enddate) this.enddate = enddate;
    if (status) this.status = status;
    if (pm) this.pm = pm;
    if (lead) this.lead = lead;
  }

  // Important: TypeORM allows only one primary key, 
  // so by default @PrimaryColumn() on project_id WILL OVERRIDE
  //  the inherited id from AbstractEntity
  @Column()
  project_id: string;

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
  @JoinColumn({ name: 'leadId' })
  lead: User;

  @OneToMany(() => ProjectUser, pu => pu.project)
  projectUsers: ProjectUser[];

  @OneToMany(() => Note, note => note.project)
  notes: Note[];

  @OneToMany(() => ProjectEngineerRequirement, r => r.project, { cascade: true })
  requirements: ProjectEngineerRequirement[];
}


