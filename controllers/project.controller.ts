import { CreateProjectDto } from "../dto/projectDto/createProjectDto";
import { UpdateProjectDto } from "../dto/projectDto/updateProjectDto";
import HttpException from "../exceptions/httpException";
import ProjectService from "../services/project.service";
import { Request, Response, Router, NextFunction } from "express";
import { checkRole } from "../middlewares/authorizationMiddleware";

export default class ProjectController {
  
  constructor(private projectService: ProjectService, router: Router) {
    router.post("/", this.createProject.bind(this));
    //router.get("/", checkRole(["HR"]), this.getAllProjects.bind(this));
    router.get("/", this.getAllProjects.bind(this));
    router.get("/:id", this.getProjectById.bind(this));
    router.get("/user/:userId", this.getProjectsByUserId.bind(this));
    router.put("/:id", this.updateProject.bind(this));
    router.delete("/:id", this.deleteProject.bind(this));
    router.post("/:id/assign-engineer", this.assignEngineerToProject.bind(this));
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
      const projects = await this.projectService.getProjectsByUserId(userId);
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
      const {engineers}= req.body;
      console.log("engineers:\n", engineers);
      let userIds=[]
      engineers.forEach((engineer) => { userIds.push(engineer.user_id) })
      console.log("userIds(contr):", userIds);

      await this.projectService.assignEngineerToProject(id, userIds, engineers);

      resp.status(201).send({"message":"Engineer assigned to project successfully"});

    } catch(err){
        console.log(err)
        next(err);
    }

  }
}
