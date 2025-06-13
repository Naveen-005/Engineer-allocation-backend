import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Skill } from './skill.entity';

@Entity('user_skills')
export class UserSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.userSkills)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Skill, skill => skill.userSkills)
  @JoinColumn({ name: 'skill_id' })
  skill: Skill;
}
