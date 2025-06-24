import { CreateProjectDto } from "../dto/projectDto/createProjectDto";
import { UpdateProjectDto } from "../dto/projectDto/updateProjectDto";
import CreateRequirementDto from "../dto/requirementDto/createRequirementDto";
import { Project } from "../entities/projectEntities/project.entity";
import { ProjectEngineerRequirement } from "../entities/projectEntities/projectEngineerRequirement.entity";
import ProjectUserRepository from "../repositories/projectRepository/projectUser.repository";

import { User } from "../entities/userEntities/user.entity";
import HttpException from "../exceptions/httpException";
import ProjectRepository from "../repositories/projectRepository/project.repository";
import UserService from "./user.service";
import { ProjectUser } from "../entities/projectEntities/projectUser.entity";
import { Designation } from "../entities/userEntities/designation.entity";
import { DesignationService } from "./designation.service";
import ProjectEngineerRequirementRepository from "../repositories/requirement.repository";
import { ProjectEngineerRequirementSkill } from "../entities/projectEntities/projectEngineerRequirementSkill.entity";
import { Skill } from "../entities/skill.entity";

class ProjectService {
  constructor(
    private projectRepository: ProjectRepository,
    private userService: UserService,
    private designationService: DesignationService,
    private projectUserRepository: ProjectUserRepository,
    private requirementRepository: ProjectEngineerRequirementRepository
  ) {}
 async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
  console.log("here", createProjectDto.requirements);
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

    const savedProject = await this.projectRepository.create(newProject);

    if (createProjectDto.requirements && createProjectDto.requirements.length > 0) {
      for (const req of createProjectDto.requirements) {
        // Create requirement skills array properly
        const requirementSkills = req.requirement_skills?.map(skill => {
          const requirementSkill = new ProjectEngineerRequirementSkill();
          requirementSkill.skill = { skill_id: skill.skill_id }  as Skill;
          return requirementSkill;
        }) || [];

        console.log("skills" , requirementSkills)

        await this.requirementRepository.create({
          project: savedProject,
          designation: { id: req.designation_id } as Designation,
          required_count: req.required_count,
          is_requested: req.is_requested,
          requirementSkills: requirementSkills
        });
      }
    }
    return savedProject;
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

  async getProjectsByUserId(
    userId: number,
    filter?: string
  ): Promise<Project[]> {
    try {
      const projects = await this.projectRepository.findByEmployeeId(
        userId,
        filter
      );
      return projects;
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to retrieve projects for employee ${userId}: ${error.message}`
      );
    }
  }

  async updateProject(
    id: number,
    updateProjectDto: UpdateProjectDto
  ): Promise<Project> {
    try {
      const project = await this.projectRepository.findOneById(id);
      if (!project) {
        throw new HttpException(404, `Project with ID ${id} not found`);
      }

      // Update project fields
      if (updateProjectDto.name !== undefined) {
        project.name = updateProjectDto.name;
      }

      if (updateProjectDto.startdate !== undefined) {
        project.startdate = new Date(updateProjectDto.startdate);
      }

      if ("enddate" in updateProjectDto) {
        project.enddate = updateProjectDto.enddate
          ? new Date(updateProjectDto.enddate)
          : null;
        project.status = "IN PROGRESS"
      }

      if (updateProjectDto.status !== undefined) {
        project.status = updateProjectDto.status;
      }

      if (updateProjectDto.pmId !== undefined) {
        project.pm = { id: updateProjectDto.pmId } as User;
      }

      if (updateProjectDto.leadId !== undefined) {
        project.lead = { id: updateProjectDto.leadId } as User;
      }

      // Save updated project
      return await this.projectRepository.update(id, project);
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to update project with ID ${id}: ${error.message}`
      );
    }
  }

  // Service for Updating Project Requirements Uses functions in requirement.repository.ts
  async updateProjectRequirement(
    requirementId: number,
    updateData: Partial<ProjectEngineerRequirement>
  ): Promise<ProjectEngineerRequirement> {
    const requirementRepo = new ProjectEngineerRequirementRepository();
    return requirementRepo.update(requirementId, updateData);
  }
  // Service for Adding Project Requirements Uses functions in requirement.repository.ts
  // async addProjectRequirement(
  //   requirementData: Partial<ProjectEngineerRequirement>
  // ): Promise<ProjectEngineerRequirement> {
  //   const requirementRepo = new ProjectEngineerRequirementRepository();
  //   return requirementRepo.create(requirementData);
  // }

  async addProjectRequirement(
  requirementData: {
    project: Project;
    designation: Designation;
    required_count: number;
    is_requested: boolean;
    requirement_skills?: { skill_id: number }[];
  }
): Promise<ProjectEngineerRequirement> {
  try {
    // Create requirement skills array
    const requirementSkills = requirementData.requirement_skills?.map(skill => {
      const requirementSkill = new ProjectEngineerRequirementSkill();
      requirementSkill.skill = { skill_id: skill.skill_id } as Skill;
      return requirementSkill;
    }) || [];

    // Create the requirement with skills
    const newRequirement = await this.requirementRepository.create({
      project: requirementData.project,
      designation: requirementData.designation,
      required_count: requirementData.required_count,
      is_requested: requirementData.is_requested,
      requirementSkills: requirementSkills
    });

    return newRequirement;
  } catch (error) {
    throw new HttpException(
      500,
      `Failed to add project requirement: ${error.message}`
    );
  }
}

  // Service for Deleting Project Requirements Uses functions in requirement.repository.ts
  async deleteProjectRequirement(requirementId: number): Promise<void> {
    const requirementRepo = new ProjectEngineerRequirementRepository();
    await requirementRepo.delete(requirementId);
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

  async assignEngineerToProject(
    id: number,
    engineers: { user_id: string; requirement_id: number }[]
  ): Promise<void> {
    try {
      const project = await this.projectRepository.findOneById(id);
      if (!project) {
        throw new HttpException(404, `Project with ID ${id} not found`);
      }

      const projectUsers = await Promise.all(
        engineers.map(async (engineer) => {
          const user = await this.userService.getUserProjects(engineer.user_id);
          if (
            user.projectUsers.length +
              user.leadProjects.length +
              user.managedProjects.length >=
            2
          ) {
            throw new HttpException(
              400,
              `User with ID ${engineer.user_id} is already assigned in maximum mumber of projects`
            );
          }
          const projectUser = new ProjectUser();
          projectUser.project = project;
          projectUser.user = await this.userService.getUserById(
            engineer.user_id
          );
          projectUser.requirement = await this.requirementRepository.getById(
            engineer.requirement_id
          );

          projectUser.assigned_on = new Date();
          return projectUser;
        })
      );

      await this.projectRepository.saveProjectUsers(projectUsers);
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to assign engineers to project: ${error.message}`
      );
    }
  }

  async removeEngineerFromProject(
    id: number,
    userIds: string[]
  ): Promise<void> {
    try {
      await Promise.all(
        userIds.map(async (userId) => {
          let projectAssignment =
            await this.projectUserRepository.findUserAssignmentByProjectIdAndUserId(
              userId,
              id
            );
          if (!projectAssignment) {
            throw new Error("User assignment not found");
          }
          projectAssignment.end_date = new Date();
          await this.projectUserRepository.update(projectAssignment);
        })
      );
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to remove engineer from project: ${error.message}`
      );
    }
  }

  async getAdditionalRequests() {
    try {
      return await this.requirementRepository.getAllAdditionalRequests();
    } catch (error) {
      throw new HttpException(
        500,
        `Failed to get additional requests: ${error.message}`
      );
    }
  }

  async setAsRequest(id){
    try{

      let requirement = await this.requirementRepository.getById(id);
      if (!requirement) {
        throw new HttpException(404, `Requirement with ID ${id} not found`);
      }
      requirement.is_requested = !requirement.is_requested;
      await this.requirementRepository.save(requirement);
      return
    }catch (error) {
      throw new HttpException(
        500,
        `Failed to set requirement as requested: ${error.message}`
      );
    }
  }
}

export default ProjectService;

/*
EXAMPLE BODY

CREATE PROJECT :
    {
      "project_id": 1000,
      "name": "Engineer Allocation Project",
      "startdate": "2025-06-15T00:00:00Z",
      "enddate": "2025-09-15T00:00:00Z",
      "status": "In Progress",
      "pmId": 25,
      "leadId": 23,
      "requirements" : 
      [{
          "required_count" : 1,
          "designation_id" : 1,
          "is_requested" : false
      },
      {
          "required_count" : 4,
          "designation_id" : 2,
          "is_requested" : false
      }
      ]
    }


    {
    "user_id" : "KV30",
    "name" : "Test PM",
    "email" : "testpm@email.com",
    "password" : "qwerty",
    "joined_at" : "2025-06-15T00:00:00Z",
    "experience" : 3,
    "role_id" : 2
}

*/
