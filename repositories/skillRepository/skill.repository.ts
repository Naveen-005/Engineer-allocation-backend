import {  Repository } from "typeorm";
import { Skill } from "../../entities/skill.entity";


class SkillRepository {
  constructor(private repository: Repository<Skill>) {}

  async list(): Promise<Skill[]> {
    return this.repository.find();
  }
}

export default SkillRepository;
