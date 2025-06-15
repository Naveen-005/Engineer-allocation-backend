import { CreateProjectDto } from "../dto/projectDto/createProjectDto";
import ProjectService from "../services/project.service";
import { Request, Response, Router, NextFunction } from "express";


export default class ProjectController {
  constructor(private projectService: ProjectService, router: Router) {
        router.post("/",  this.createProject.bind(this)); 
  }

  async createProject(req : Request, res : Response, next: NextFunction){
     try {
      const createProjectDto: CreateProjectDto = req.body;

      const createdProject = await this.projectService.createProject(createProjectDto);

      res.status(201).json({
        message: "Project created successfully",
        data: createdProject,
      });
    } catch (error) {
      next(error);
    }
  }
}