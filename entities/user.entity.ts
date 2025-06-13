import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { UserSkill } from './userSkill.entity';
import { Project } from './project.entity';
import { ProjectUser } from './projectUser.entity';
import { UserDesignation } from './userDesignation.entity';
import { Note } from './note.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'date', nullable: true })
  joined_at: Date;

  @Column({ nullable: true })
  experience: number;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => UserSkill, us => us.user)
  userSkills: UserSkill[];

  @OneToMany(() => Project, p => p.pm)
  managedProjects: Project[];

  @OneToMany(() => Project, p => p.lead)
  leadProjects: Project[];

  @OneToMany(() => ProjectUser, pu => pu.user)
  projectUsers: ProjectUser[];

  @OneToMany(() => Note, note => note.author)
  notes: Note[];

  @OneToMany(() => UserDesignation, ud => ud.user)
  designations: UserDesignation[];
}
