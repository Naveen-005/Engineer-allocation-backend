import { In, Repository } from "typeorm";
import { Project } from "../../entities/projectEntities/project.entity";

class ProjectRepository {
  constructor(private repository: Repository<Project>) {}
  
  async create(project: Project): Promise<Project> {
    return this.repository.save(project);
  }

  async findMany(): Promise<Project[]> {
    return this.repository.find({
      relations: {
        pm: true,
        lead: true,
        projectUsers: { user: true },
        notes: { author: true },
        requirements: true,
      },
    });
  }

  async findOneById(id: number): Promise<Project> {
    return this.repository.findOne({
      where: { id  },
      relations: {
        pm: true,
        lead: true,
        projectUsers: { user: true },
        notes: { author: true },
        requirements: true,
      },
    });
  }

  async findOneByProjectId(p_id: string): Promise<Project> {
    return this.repository.findOne({
      where: { project_id: p_id },
      relations: {
        pm: true,
        lead: true,
        projectUsers: { user: true },
        notes: { author: true },
        requirements: true,
      },
    });
  }

  async update(id: number, project: Project) {
    await this.repository.save({ id, ...project });
  }

  async delete(id: number) {
    await this.repository.delete(id);
  }

  async remove(project: Project) {
    await this.repository.softRemove(project);
  }
}

export default ProjectRepository;
