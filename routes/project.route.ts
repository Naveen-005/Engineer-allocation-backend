import express from "express";
import datasource from "../db/data-source";
import ProjectRepository from "../repositories/projectRepository/project.repository";
import { Project } from "../entities/projectEntities/project.entity";
import ProjectService from "../services/project.service";
import ProjectController from "../controllers/project.controller";

const projectRouter = express.Router()

const projectRepository = new ProjectRepository(datasource.getRepository(Project))
const projectService = new ProjectService(projectRepository)
const projectController = new ProjectController(projectService, projectRouter)

export default projectRouter

