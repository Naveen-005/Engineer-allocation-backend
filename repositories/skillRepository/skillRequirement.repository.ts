import {  Repository } from "typeorm";
import { ProjectEngineerRequirementSkill } from "../../entities/projectEntities/projectEngineerRequirementSkill.entity";


class SkillRequirementRepository {
  constructor(private repository: Repository<ProjectEngineerRequirementSkill>) {}

  async findByRequirementId(id): Promise<ProjectEngineerRequirementSkill> {
    return this.repository.findOneBy({id});
  }
}

export default SkillRequirementRepository;
