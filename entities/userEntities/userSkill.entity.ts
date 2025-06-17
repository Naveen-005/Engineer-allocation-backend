import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import AbstractEntity from "../abstract.entity";
import { User } from "./user.entity";
import { Skill } from "../skill.entity";

@Entity("user_skills")
export class UserSkill extends AbstractEntity {
  constructor(user?: User, skill?: Skill) {
    super();
    if (user) this.user = user;
    if (skill) this.skill = skill;
  }

  @ManyToOne(() => User, (user) => user.userSkills)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" }) // Reference the primary key 'id'
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills)
  @JoinColumn({ name: "skill_id" })
  skill: Skill;
}
