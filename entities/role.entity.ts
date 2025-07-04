import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./userEntities/user.entity";
import AbstractEntity from "./abstract.entity";

@Entity("roles")
export class Role extends AbstractEntity {
  constructor(role_name?: string) {
    super();
    if (role_name) this.role_name = role_name;
  }

  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ unique: true })
  role_name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
