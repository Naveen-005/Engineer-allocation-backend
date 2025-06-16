import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Designation } from './designation.entity';
import AbstractEntity from '../abstract.entity';


@Entity('user_designation')
export class UserDesignation extends AbstractEntity {
  @ManyToOne(() => User, user => user.designations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Designation, designation => designation.userDesignations)
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;
}
