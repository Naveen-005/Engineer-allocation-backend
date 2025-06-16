import { CreateProjectDto } from "../dto/projectDto/createProjectDto";
import { UpdateProjectDto } from "../dto/projectDto/updateProjectDto";
import { Project } from "../entities/projectEntities/project.entity";
import { User } from "../entities/userEntities/user.entity";
import HttpException from "../exceptions/httpException";
import ProjectRepository from "../repositories/projectRepository/project.repository";
import UserService from "./user.service";
import { ProjectUser } from "../entities/projectEntities/projectUser.entity";
import { Designation } from "../entities/userEntities/designation.entity";
import {DesignationService} from "./designation.service";

class ProjectService {
  constructor(private projectRepository: ProjectRepository,
    private userService: UserService,
    private designationService: DesignationService
   ) {}
  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      const newProject = new Project(
        createProjectDto.project_id,
        createProjectDto.name,
        createProjectDto.startdate
          ? new Date(createProjectDto.startdate)
          : undefined,
        createProjectDto.enddate
          ? new Date(createProjectDto.enddate)
          : undefined,
        createProjectDto.status,
        { id: createProjectDto.pmId } as User,
        { id: createProjectDto.leadId } as User
      );

      return await this.projectRepository.create(newProject);
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to create project: ${error.message}`
      );
    }
  }

  async getAllProjects(): Promise<Project[]> {
    try {
      const projects = await this.projectRepository.findMany();
      return projects;
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to retrieve project: ${error.message}`
      );
    }
    return;
  }

  async getProjectById(id: number): Promise<Project> {
    try {
      const project = await this.projectRepository.findOneById(id);
      if (!project) {
        throw new HttpException(404, `Project with ID ${id} not found`);
      }
      return project;
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to retrieve project ${id}: ${error.message}`
      );
    }
  }

  async getProjectByProjectId(p_id: string): Promise<Project> {
    try {
      const project = await this.projectRepository.findOneByProjectId(p_id);
      if (!project) {
        throw new HttpException(404, `Project with ID ${p_id} not found`);
      }
      return project;
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to retrieve project ${p_id}: ${error.message}`
      );
    }
  }

  async updateProject(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.projectRepository.findOneById(id);
      if (!project) {
        throw new HttpException(404, `Project with ID ${id} not found`);
      }
      if (updateProjectDto.name !== undefined) {
        project.name = updateProjectDto.name;
      }

      if (updateProjectDto.startdate !== undefined) {
        project.startdate = new Date(updateProjectDto.startdate);
      }

      if (updateProjectDto.enddate !== undefined) {
        project.enddate = new Date(updateProjectDto.enddate);
      }

      if (updateProjectDto.status !== undefined) {
        project.status = updateProjectDto.status;
      }

      if (updateProjectDto.pmId !== undefined) {
        // const pm = await this.userRepository.findOneBy({
        //   id: updateProjectDto.pmId,
        // });
        // if (!pm)
        //   throw new HttpException(
        //     404,
        //     `Project Manager with ID ${updateProjectDto.pmId} not found`
        //   );
        // project.pm = pm;
      }

      if (updateProjectDto.leadId !== undefined) {
        // const lead = await this.userRepository.findOneBy({
        //   id: updateProjectDto.leadId,
        // });
        // if (!lead)
        //   throw new HttpException(
        //     404,
        //     `Lead with ID ${updateProjectDto.leadId} not found`
        //   );
        // project.lead = lead;
      }

      const updatedProject = await this.projectRepository.update(id, project);

      return updatedProject;
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to update project with ID ${id}: ${error.message}`
      );
    }
  }

  async deleteProject(id: number) {
    try {
      const projectExist = await this.projectRepository.findOneById(id);
      if (!projectExist) {
        throw new HttpException(404, `project with ID ${id} not found`);
      }
      await this.projectRepository.remove(projectExist);
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to delete deparprojecttment with ID ${id}: ${error.message}`
      );
    }
  }

  async assignEngineerToProject(id: number, userIds: string[], engineers: {user_id:string,designation_id:number}[]): Promise<void> {
    try {
      const project = await this.projectRepository.findOneById(id);
      if (!project) {
        throw new HttpException(404, `Project with ID ${id} not found`);
      }

      const projectUsers = await Promise.all(engineers.map(async engineer => {
        const projectUser = new ProjectUser();
        projectUser.project = project;
        projectUser.user = await this.userService.getUserById(engineer.user_id);
        projectUser.designation = await this.designationService.getDesignationById(engineer.designation_id);
        projectUser.assigned_on = new Date();
        return projectUser;
      }));

      await this.projectRepository.saveProjectUsers(projectUsers);
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to assign engineers to project: ${error.message}`
      );
    }
  }
}

export default ProjectService;
