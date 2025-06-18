import UserRepository from "../repositories/userRepository/user.repository";
import UserSkillRepository from "../repositories/userSkill.repository";

import dataSource from "../db/data-source";
import HttpException from "../exceptions/httpException";

import { User } from "../entities/userEntities/user.entity";

import { Skill } from "../entities/skill.entity";
import { UserSkill } from "../entities/userEntities/userSkill.entity";
import { LoggerService } from '../services/logger.service';

class UserSkillService {
  private logger = LoggerService.getInstance(UserSkillService.name);
  private skillRepo = dataSource.getRepository(Skill);

  constructor(
    private userSkillRepository: UserSkillRepository,
    private userRepo: UserRepository
  ) {}

  async addSkillToUser(userId: number, skillId: number): Promise<UserSkill> {
    this.logger.info(`Adding skill ${skillId} to user ${userId}`);
    
    const user_id = await this.userRepo.findUserId(userId);
    if(!user_id){
        this.logger.error(`User ${userId} not found`);
        throw new HttpException(401, "User Not Found");
    }
    
    const user = await this.userRepo.findOneById(user_id.user_id);
    if (!user) {
      this.logger.error(`User ${user_id.user_id} not found`);
      throw new HttpException(401, "User Not Found");
    }

    const skill = await this.skillRepo.findOne({
      where: { skill_id: skillId },
    });
    if (!skill) {
      this.logger.error(`Skill ${skillId} not found`);
      throw new HttpException(401, "Skill Not Found");
    }

    const existing = await this.userSkillRepository.findOne(userId, skillId);
    if (existing) {
      this.logger.error(`User ${userId} already has skill ${skillId}`);
      throw new HttpException(403, "User already has this skill");
    }

    const userSkill = new UserSkill();
    userSkill.user = user;
    userSkill.skill = skill;

    const savedUserSkill = await this.userSkillRepository.add(userSkill);
    this.logger.info(`Successfully added skill ${skillId} to user ${userId}`);
    return savedUserSkill;
  }

  async removeSkillFromUser(userId: number, skillId: number): Promise<void> {
    this.logger.info(`Removing skill ${skillId} from user ${userId}`);
    
    const existing = await this.userSkillRepository.findOne(userId, skillId);
    if (!existing) {
      this.logger.error(`Skill ${skillId} not assigned to user ${userId}`);
      throw new HttpException(403, "Skill not assigned to user");
    }
    
    await this.userSkillRepository.remove(existing);
    this.logger.info(`Successfully removed skill ${skillId} from user ${userId}`);
  }

  async getUserSkills(userId: number): Promise<UserSkill[]> {
    this.logger.info(`Fetching skills for user ${userId}`);
    
    const skills = await this.userSkillRepository.findByUserId(userId);
    
    if (!skills) {
      this.logger.error(`No skills found for user ${userId}`);
      throw new HttpException(404, "No skills found for the user");
    }
    
    this.logger.info(`Fetched ${skills.length} skills for user ${userId}`);
    return skills;
  }
}

export default UserSkillService;