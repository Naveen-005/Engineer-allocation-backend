import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ unique: true })
  role_name: string;

  @OneToMany(() => User, user => user.role)
  users: User[];
}
