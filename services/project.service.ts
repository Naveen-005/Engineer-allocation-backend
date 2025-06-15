import { CreateProjectDto } from "../dto/projectDto/createProjectDto";
import { Project } from "../entities/projectEntities/project.entity";
import { User } from "../entities/userEntities/user.entity";
import HttpException from "../exceptions/httpException";
import ProjectRepository from "../repositories/projectRepository/project.repository";

class ProjectService {
  constructor(private projectRepository: ProjectRepository) {} 
    async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const newProject = new Project(
        createProjectDto.project_id,
        createProjectDto.name,
        createProjectDto.startdate ? new Date(createProjectDto.startdate) : undefined,
        createProjectDto.enddate ? new Date(createProjectDto.enddate) : undefined,
        createProjectDto.status,
        { id: createProjectDto.pmId } as User,
        { id: createProjectDto.leadId } as User
      );

      return await this.projectRepository.create(newProject);
    } catch (error) {
      throw new HttpException(500, `Failed to create project: ${error.message}`);
    }
  }

}

export default ProjectService