import { CreateProjectDto } from "../dto/projectDto/createProjectDto";
import { UpdateProjectDto } from "../dto/projectDto/updateProjectDto";
import HttpException from "../exceptions/httpException";
import ProjectService from "../services/project.service";
import { Request, Response, Router, NextFunction } from "express";
import { checkRole } from "../middlewares/authorizationMiddleware";
import { auditLogMiddleware } from "../middlewares/auditLogMiddleware";
import { AuditActionType } from "../entities/auditLog.entity";
import { verifyRole, verifyUser } from "../utils/authorization";
import { verify } from "crypto";
import AuditLogRepository from "../repositories/auditLog.repository";
import { Project } from "../entities/projectEntities/project.entity";
import { Designation } from "../entities/userEntities/designation.entity";

export default class ProjectController {
  
  constructor(private projectService: ProjectService, router: Router) {
    router.post("/",auditLogMiddleware(AuditActionType.CREATE_PROJECT), this.createProject.bind(this));
    router.get("/", this.getAllProjects.bind(this));
    router.get("/requests", checkRole(["HR"]), this.getAdditionalRequests.bind(this));
    router.post("/requirement", auditLogMiddleware(AuditActionType.REQUIREMENTS_UPDATE), this.addProjectRequirement.bind(this));
    router.put("/requirement/:requirementId", auditLogMiddleware(AuditActionType.REQUIREMENTS_UPDATE), this.updateProjectRequirement.bind(this));
    router.post("/requirement/:requirementId", this.setAsRequest.bind(this));
    router.delete("/requirement/:requirementId", auditLogMiddleware(AuditActionType.REQUIREMENTS_UPDATE), this.deleteProjectRequirement.bind(this))
    router.get("/user/:userId", this.getProjectsByUserId.bind(this));
    router.get("/:id", this.getProjectById.bind(this));
    router.put("/:id",auditLogMiddleware(AuditActionType.UPDATE_PROJECT), this.updateProject.bind(this));
    router.delete("/:id",auditLogMiddleware(AuditActionType.CLOSE_PROJECT), this.deleteProject.bind(this));
    router.post("/:id/engineer", auditLogMiddleware(AuditActionType.ASSIGN_USER), this.assignEngineerToProject.bind(this));
    router.delete("/:id/engineer", auditLogMiddleware(AuditActionType.REMOVE_USER), this.removeEngineerFromProject.bind(this));
    //router for project requirements
    
    
  }


  
  async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const createProjectDto: CreateProjectDto = req.body;

      const createdProject = await this.projectService.createProject(
        createProjectDto
      );

      res.status(201).json({
        message: "Project created successfully",
        data: createdProject,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllProjects(req: Request, resp: Response) {
    const projects = await this.projectService.getAllProjects();
    resp.status(200).send(projects);
  }

  async getProjectById(req: Request, resp: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const project = await this.projectService.getProjectById(id);
      if (!project) {
        throw new HttpException(
          404,
          `Project with the id ${id} does not exist`
        );
      }
      resp.status(200).send(project);
    } catch (error) {
      next(error);
    }
  }

  async getProjectsByUserId(req: Request, resp: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId);
      const filter = req.query.filter as string;
      console.log(userId, filter)
      const projects = await this.projectService.getProjectsByUserId(userId, filter);
      if (!projects || projects.length === 0) {
        throw new HttpException(
          404,
          `No projects found for employee with ID ${userId}`
        );
      }
      resp.status(200).send(projects);
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const updateProjectDto: UpdateProjectDto = req.body;

      console.log(req.body);

      const updatedProject = await this.projectService.updateProject(
        id,
        updateProjectDto
      );

      res.status(200).json({
        message: "Project updated successfully",
        data: updateProjectDto,
      });
    } catch (error) {
      next(error);
    }
  }

  // Add a new project requirement
  async addProjectRequirement(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        project_id,
        designation_id,
        required_count,
        is_requested,
        requirement_skills
      } = req.body;

      // Validate required fields
      if (!project_id || !designation_id || required_count === undefined) {
        throw new HttpException(400, 'Missing required fields');
      }

      // Get the project first (assuming you have a method to get it)
      const project = await this.projectService.getProjectById(project_id);
      
      const newRequirement = await this.projectService.addProjectRequirement({
        project: { id: project.id } as Project,
        designation: { id: designation_id } as Designation,
        required_count: required_count,
        is_requested: is_requested || false, // default to false if not provided
        requirement_skills: requirement_skills || [] // handle case where skills aren't provided
      });

      res.status(201).json({
        message: "Project requirement added successfully",
        data: newRequirement,
      });
    } catch (error) {
      next(error);
    }
}

  // Update an existing project requirement
  async updateProjectRequirement(req: Request, res: Response, next: NextFunction) {
    try {
      const requirementId = Number(req.params.requirementId);
      const updateData = req.body;
      const updatedRequirement = await this.projectService.updateProjectRequirement(requirementId, updateData);
      res.status(200).json({
        message: "Project requirement updated successfully",
        data: updatedRequirement,
      });
    } catch (error) {
      next(error);
    }
  }
  //Delete a project requirement (soft delete)
  async deleteProjectRequirement(req: Request, res: Response, next: NextFunction) {
    try {
      const requirementId = Number(req.params.requirementId);
      await this.projectService.deleteProjectRequirement(requirementId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async setAsRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const requirementId = Number(req.params.requirementId);
      await this.projectService.setAsRequest(requirementId);
      res.status(200).send("Requirement set as requested successfully");
    } catch (error) {
      next(error);
    }

  }


  async deleteProject(req: Request, resp: Response) {
    try {
      const id = Number(req.params.id);
      await this.projectService.deleteProject(id);
      resp.status(204).send();
    } catch (error) {
      resp.status(400).send(JSON.stringify({ error: error }));
    }
  }

  async assignEngineerToProject(req: Request, resp: Response, next: NextFunction) {
    try{

      const id = Number(req.params.id);

      

      const project = await this.projectService.getProjectById(id);
      if (!project) {
        throw new HttpException(
          404,
          `Project with the id ${id} does not exist`
        );
      }

      if(!(verifyRole(req,["HR"]) || verifyUser(req, [project.pm.id,project.lead.id]))){

        throw new HttpException(403, "User is not authorized");

      }

      const {engineers}= req.body;

      await this.projectService.assignEngineerToProject(id, engineers);

      

      resp.status(201).send({"message":"Engineer assigned to project successfully"});

      // Audit log only after success
      // const auditLogRepo = new AuditLogRepository();
      // const actor_user_id = req.user.user_id;
      // const users = engineers.map(e => e.user_id).join(", ");
      // await auditLogRepo.create({
      //   actor_user_id,
      //   action_type: AuditActionType.ASSIGN_USER,
      //   change_summary: `Assigned users [${users}] to project ${id}`,
      //   timestamp: new Date(),
      // });


      

    } catch(err){

        next(err);
    }

  }

  async removeEngineerFromProject(req: Request, resp: Response, next: NextFunction) {

    try{

      const id = Number(req.params.id);
      const project = await this.projectService.getProjectById(id);
      if (!project) {
        throw new HttpException(
          404,
          `Project with the id ${id} does not exist`
        );
      }

      if(!(verifyRole(req,["HR"]) || verifyUser(req, [project.pm.id,project.lead.id]))){

        throw new HttpException(403, "User is not authorized");

      }
      const {engineers}= req.body;

      await this.projectService.removeEngineerFromProject(id, engineers);


      resp.status(204).send({"message":"Engineer removed from project"});
    } catch(err){
        
        next(err);
    }
  }

  async getAdditionalRequests(req: Request, resp: Response, next: NextFunction) {

    try{

      let additionalRequests = await this.projectService.getAdditionalRequests();

      const sorted = additionalRequests.sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      })


      resp.status(200).json({"message":"success",
        data: additionalRequests
      });

    } catch(err){
        
        next(err);
    }
  }
}
