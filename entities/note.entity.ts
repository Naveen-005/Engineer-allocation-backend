import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './userEntities/user.entity';
import { Project } from './projectEntities/project.entity';
import AbstractEntity from './abstract.entity';
@Entity('notes')
export class Note extends AbstractEntity{


  @ManyToOne(() => Project, project => project.notes)
  @JoinColumn({ name: 'p_id' })
  project: Project;

  @ManyToOne(() => User, user => user.notes)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column('text')
  content: string;
}
