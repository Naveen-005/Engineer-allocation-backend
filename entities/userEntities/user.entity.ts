import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { Role } from '../role.entity';
import { Note } from '../note.entity';
import AbstractEntity from '../abstract.entity';
import { UserSkill } from './userSkill.entity';
import { Project } from '../projectEntities/project.entity';
import { ProjectUser } from '../projectEntities/projectUser.entity';
import { UserDesignation } from './userDesignation.entity';


@Entity('users')
export class User extends AbstractEntity {
    constructor(
    user_id?: string,
    email?: string,
    name?: string,
    password?: string,
    joined_at?: Date,
    experience?: number,
    role?: Role
  ) {
    super();
    if (user_id !== undefined) this.user_id = user_id;
    if (email) this.email = email;
    if (name) this.name = name;
    if (password) this.password = password;
    if (joined_at) this.joined_at = joined_at;
    if (experience !== undefined) this.experience = experience;
    if (role) this.role = role;
  }
  
  @Column({ unique: true })
  user_id: string;

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
