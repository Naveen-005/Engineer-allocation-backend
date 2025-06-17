import UserRepository from "../repositories/userRepository/user.repository";
import UserSkillRepository from "../repositories/userSkill.repository";

import dataSource from "../db/data-source";
import HttpException from "../exceptions/httpException";

import { User } from "../entities/userEntities/user.entity";

import { Skill } from "../entities/skill.entity";
import { UserSkill } from "../entities/userEntities/userSkill.entity";

class UserSkillService {
  constructor(
    private userSkillRepository: UserSkillRepository,
    private userRepo: UserRepository
  ) {}
  private skillRepo = dataSource.getRepository(Skill);

  async addSkillToUser(userId: number, skillId: number): Promise<UserSkill> {
    //console.log("inside service")
    const user_id = await this.userRepo.findUserId(userId);
    if(!user_id){
        throw new HttpException(401, "User Not Found");
    }
    //console.log("insinde service", user_id,user_id.user_id)
    const user = await this.userRepo.findOneById(user_id.user_id);
    if (!user) {
      throw new HttpException(401, "User Not Found");
    }

    const skill = await this.skillRepo.findOne({
      where: { skill_id: skillId },
    });
    if (!skill) {
      throw new HttpException(401, "Skill Not Found");
    }

    const existing = await this.userSkillRepository.findOne(userId, skillId);
    if (existing) {
      throw new HttpException(403, "User already has this skill");
    }

    const userSkill = new UserSkill();
    userSkill.user = user;
    userSkill.skill = skill;

    return this.userSkillRepository.add(userSkill);
  }

  async removeSkillFromUser(userId: number, skillId: number): Promise<void> {
    const existing = await this.userSkillRepository.findOne(userId, skillId);
    if (!existing) {
      throw new HttpException(403, "Skill not assigned to user");
    }
    await this.userSkillRepository.remove(existing);
  }

  async getUserSkills(userId: number): Promise<UserSkill[]> {
    console.log("inside service")
    const skills = this.userSkillRepository.findByUserId(userId);
    console.log("fetched skill")
    if (!skills ) {
      throw new HttpException(404, "No skills found for the user");
    }
    return skills;
  }
}

export default UserSkillService;
