import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjectEngineerRequirement } from '../projectEntities/projectEngineerRequirement.entity';
import { UserDesignation } from './userDesignation.entity';
import AbstractEntity from '../abstract.entity';
import { ProjectUser } from '../projectEntities/projectUser.entity';

@Entity("designation")
export class Designation extends AbstractEntity {
  constructor(name?: string) {
    super();
    if (name) this.name = name;
  }
  @Column({ unique: true })
  name: string;

  @OneToMany(() => UserDesignation, (ud) => ud.designation)
  userDesignations: UserDesignation[];

  @OneToMany(() => ProjectEngineerRequirement, (r) => r.designation)
  requirements: ProjectEngineerRequirement[];

}
