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
import { ProjectUser } from "../entities/projectEntities/projectUser.entity";
import ProjectUserRepository from "../repositories/projectRepository/projectUser.repository";
import ProjectEngineerRequirementRepository from "../repositories/requirement.repository";
import { ProjectEngineerRequirement } from "../entities/projectEntities/projectEngineerRequirement.entity";

const projectRouter = express.Router()

const projectRepository = new ProjectRepository(datasource.getRepository(Project))
const designationRepository = new DesignationRepository(datasource.getRepository(Designation))
const projectUserRepository = new ProjectUserRepository(datasource.getRepository(ProjectUser))
const projectRequirementRepository = new ProjectEngineerRequirementRepository()
const designationService = new DesignationService(designationRepository)
const projectService = new ProjectService(projectRepository, userService, designationService, projectUserRepository,projectRequirementRepository)
const projectController = new ProjectController(projectService, projectRouter)

export default projectRouter

