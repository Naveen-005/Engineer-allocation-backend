import { In, IsNull, Not, Repository } from "typeorm";
import { Project } from "../../entities/projectEntities/project.entity";
import { ProjectUser } from "../../entities/projectEntities/projectUser.entity";

class ProjectRepository {
  constructor(private repository: Repository<Project>) {}

  async create(project: Project): Promise<Project> {
    console.log(project);
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
      where: { id },
      relations: {
        pm: true,
        lead: true,
        projectUsers: { user: true },
        notes: { author: true },
        requirements: {
          designation: true,
          projectAssignments : {
            user : true
          }
        },
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

  async findByEmployeeId(userId: number, filter?: string): Promise<Project[]> {
    const enddateCondition =
      filter === "inprogress"
        ? IsNull()
        : filter === "completed"
        ? Not(IsNull())
        : undefined;

    const where = [];

    if (enddateCondition !== undefined) {
      where.push({ pm: { id: userId }, enddate: enddateCondition });
      where.push({ lead: { id: userId }, enddate: enddateCondition });
      where.push({
        projectUsers: { user: { id: userId } },
        enddate: enddateCondition,
      });
    } else {
      where.push({ pm: { id: userId } });
      where.push({ lead: { id: userId } });
      where.push({ projectUsers: { user: { id: userId } } });
    }

    return this.repository.find({
      where,
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
   return await this.repository.save({ id, ...project });
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
