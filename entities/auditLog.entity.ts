import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./userEntities/user.entity";


export enum AuditActionType {
  ASSIGN_USER = "ASSIGN_USER",
  REMOVE_USER = "REMOVE_USER",
  CREATE_PROJECT = "CREATE_PROJECT",
  UPDATE_PROJECT = "UPDATE_PROJECT",
  CLOSE_PROJECT = "CLOSE_PROJECT",
  UPDATE_SKILLSET = "UPDATE_SKILLSET",
  REQUIREMENTS_UPDATE = "REQUIREMENTS_UPDATE",
  ADD_NOTE = "ADD_NOTE",
  REMOVE_NOTE = "REMOVE_NOTE",
  // Add more actions as needed
}

@Entity("audit_logs")
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "actor_user_id", referencedColumnName: "user_id" })
  actor: User;

  @Column()
  actor_user_id: string;

  @Column()
  actor_name: string;

  @Column({
    type: "enum",
    enum: AuditActionType,
  })
  action_type: AuditActionType;

  @CreateDateColumn({ type: "timestamp" })
  timestamp: Date;

  @Column({ type: "text", nullable: true })
  change_summary: string;
}
