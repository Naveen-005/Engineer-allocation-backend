import { In, Repository } from "typeorm";
import { Project } from "../../entities/projectEntities/project.entity";
import { ProjectUser } from "../../entities/projectEntities/projectUser.entity";

class ProjectRepository {
  constructor(private repository: Repository<Project>) {}

  async create(project: Project): Promise<Project> {
    console.log(project)
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

  async findByEmployeeId(userId: number): Promise<Project[]> {
    return this.repository.find({
      relations: {
        projectUsers: true
      },
      where: [
        { pm: { id: userId } },
        { lead: { id: userId } },
        { projectUsers: { user: { id: userId} } },
      ],
    });
  }

  async update(id: number, project: Project) {
    await this.repository.save({ id, ...project });
  }

  async addUsersToProject(project: Project): Promise<Project> {
    await this.repository.save(project);
    return this.repository.findOne({
      where: { id: project.id },
      relations: {
        pm: true,
        lead: true,
        projectUsers: { user: true },
        notes: { author: true },
        requirements: true,
      },
    });
  }

  async delete(id: number) {
    await this.repository.delete(id);
  }

  async remove(project: Project) {
    await this.repository.softRemove(project);
  }

  async saveProjectUsers(projectUsers: ProjectUser[]): Promise<void> {
    await this.repository.manager.save(ProjectUser, projectUsers);
  }
}

export default ProjectRepository;
