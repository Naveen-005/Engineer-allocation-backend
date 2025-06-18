import { Skill } from "../entities/skill.entity";
import { Designation } from "../entities/userEntities/designation.entity";
import SkillRepository from "../repositories/skillRepository/skill.repository";
import { LoggerService } from '../services/logger.service';

export class SkillService {
  private logger = LoggerService.getInstance(SkillService.name);

  constructor(private skillRepository: SkillRepository) {}

  async listSkills(): Promise<Skill[]> {
    this.logger.info('Fetching all skills');
    
    const skills = await this.skillRepository.list();
    
    this.logger.info(`Fetched ${skills.length} skills`);
    return skills;
  }
}