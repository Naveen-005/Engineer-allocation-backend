import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Designation } from "./designation.entity";
import AbstractEntity from "../abstract.entity";

@Entity("user_designation")
export class UserDesignation extends AbstractEntity {
  constructor(user?: User, designation?: Designation) {
    super();
    if (user) this.user = user;
    if (designation) this.designation = designation;
  }
  
  @ManyToOne(() => User, (user) => user.designations)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" }) // Reference the primary key 'id'
  user: User;

  @ManyToOne(() => Designation, (designation) => designation.userDesignations)
  @JoinColumn({ name: "designation_id" })
  designation: Designation;
}
