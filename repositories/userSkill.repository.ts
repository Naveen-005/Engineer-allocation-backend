import { Repository } from "typeorm";
import { UserSkill } from "../entities/userEntities/userSkill.entity";

class UserSkillRepository {
  
  constructor(private repository: Repository<UserSkill>) {}

  async add(userSkill: UserSkill): Promise<UserSkill> {
    return this.repository.save(userSkill);
  }


  async findByUserId(userId: number): Promise<UserSkill[]> {
    return this.repository.find({
      where: { user: { id: userId } },
      relations: ['skill'],
    });
  }

  async findOne(userId: number, skillId: number): Promise<UserSkill | null> {
    return this.repository.findOne({
      where: {
        user: {id: userId },
        skill: { skill_id: skillId },
      },
    });
  }

   async remove(userSkill: UserSkill): Promise<void> {
    await this.repository.remove(userSkill);
  }

  
}

export default UserSkillRepository;
