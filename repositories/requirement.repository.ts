import { Repository } from 'typeorm';
import { ProjectEngineerRequirement } from '../entities/projectEntities/projectEngineerRequirement.entity';
import { ProjectEngineerRequirementSkill } from '../entities/projectEntities/projectEngineerRequirementSkill.entity';
import dataSource from '../db/data-source';

class ProjectEngineerRequirementRepository {
  private repository: Repository<ProjectEngineerRequirement>;
  private skillRepository: Repository<ProjectEngineerRequirementSkill>;

  constructor() {
    this.repository = dataSource.getRepository(ProjectEngineerRequirement);
    this.skillRepository = dataSource.getRepository(ProjectEngineerRequirementSkill);
  }

  async create(requirement: Partial<ProjectEngineerRequirement>): Promise<ProjectEngineerRequirement> {
    return this.repository.save(requirement);
  }

  async update(id: number, updateData: Partial<ProjectEngineerRequirement>): Promise<ProjectEngineerRequirement> {
    await this.repository.update(id, updateData);
    return this.repository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    //Soft delete the skills associated with the requirement first
    await this.skillRepository.softDelete({ requirement: { id } });
    await this.repository.softDelete(id);
  }

  async getAllAdditionalRequests(): Promise<ProjectEngineerRequirement[]> {
    return this.repository.find({
      where: { is_requested: true },
      // relations: ['requirementSkills','project','designation'],
      relations:{
        requirementSkills: {
          skill: true
        },
        project: true,
        designation: true
      }
    });
  }

  async getById(id: number): Promise<ProjectEngineerRequirement | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['requirementSkills', 'project', 'designation'],
    });
  }
}

export default ProjectEngineerRequirementRepository;
