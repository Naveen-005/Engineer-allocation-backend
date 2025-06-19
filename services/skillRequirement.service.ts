
import { ProjectEngineerRequirementSkill } from "../entities/projectEntities/projectEngineerRequirementSkill.entity";
import SkillRequirementRepository from "../repositories/skillRepository/skillRequirement.repository";

export class SkillRequirementService {
  constructor(private skillRequirementRepository: SkillRequirementRepository) {}

  async findByRequirementId(id): Promise<String> {
    
    const skills = await this.skillRequirementRepository.findByRequirementId(id);
    return skills.skill.skill_name;
  }
}