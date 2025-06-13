import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';
@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  noteid: number;

  @ManyToOne(() => Project, project => project.notes)
  @JoinColumn({ name: 'p_id' })
  project: Project;

  @ManyToOne(() => User, user => user.notes)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column('text')
  content: string;
}
