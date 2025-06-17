
import { Skill } from "../entities/skill.entity";
import { Designation } from "../entities/userEntities/designation.entity";
import SkillRepository from "../repositories/skillRepository/skill.repository";

export class SkillService {
  constructor(private skillRepository: SkillRepository) {}

  async listSkills(): Promise<Skill[]> {
    return await this.skillRepository.list();
  }
}
