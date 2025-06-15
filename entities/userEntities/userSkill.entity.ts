import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import AbstractEntity from '../abstract.entity';
import { User } from './user.entity';
import { Skill } from '../skill.entity';

@Entity('user_skills')
export class UserSkill extends AbstractEntity {

  @ManyToOne(() => User, user => user.userSkills)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Skill, skill => skill.userSkills)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;
}
