import express from "express";
import datasource from "../db/data-source";
import ProjectRepository from "../repositories/projectRepository/project.repository";
import { Project } from "../entities/projectEntities/project.entity";
import ProjectService from "../services/project.service";
import ProjectController from "../controllers/project.controller";
import { userService } from "./user.route";
import { Designation } from "../entities/userEntities/designation.entity";
import {DesignationService} from "../services/designation.service";
import DesignationRepository from "../repositories/designationRepository/designation.repository";

const projectRouter = express.Router()

const projectRepository = new ProjectRepository(datasource.getRepository(Project))
const designationRepository = new DesignationRepository(datasource.getRepository(Designation))
const designationService = new DesignationService(designationRepository)
const projectService = new ProjectService(projectRepository, userService, designationService)
const projectController = new ProjectController(projectService, projectRouter)

export default projectRouter

