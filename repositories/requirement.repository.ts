import { Repository } from 'typeorm';
import { ProjectEngineerRequirement } from '../entities/projectEntities/projectEngineerRequirement.entity';
import dataSource from '../db/data-source';

class ProjectEngineerRequirementRepository {
  private repository: Repository<ProjectEngineerRequirement>;

  constructor() {
    this.repository = dataSource.getRepository(ProjectEngineerRequirement);
  }

  async create(requirement: Partial<ProjectEngineerRequirement>): Promise<ProjectEngineerRequirement> {
    return this.repository.save(requirement);
  }
}

export default ProjectEngineerRequirementRepository;
