import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Designation } from './designation.entity';

@Entity('user_designation')
export class UserDesignation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.designations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Designation, designation => designation.userDesignations)
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;
}
