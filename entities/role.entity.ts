import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './userEntities/user.entity';
import AbstractEntity from './abstract.entity';

@Entity('roles')
export class Role extends AbstractEntity {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ unique: true })
  role_name: string;

  @OneToMany(() => User, user => user.role)
  users: User[];
}
