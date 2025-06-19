import express from "express";
import datasource from "../db/data-source";
import { ProjectEngineerRequirementSkill } from "../entities/projectEntities/projectEngineerRequirementSkill.entity";
import { SkillRequirementService } from "../services/skillRequirement.service";
import SkillRequirementController from "../controllers/skillRequirement.controller";
import SkillRequirementRepository from "../repositories/skillRepository/skillRequirement.repository";

const skillRequirementRouter = express.Router();

const skillRequirementRepository = new SkillRequirementRepository(
  datasource.getRepository(ProjectEngineerRequirementSkill)
);
const skillRequirementService = new SkillRequirementService(skillRequirementRepository);
const skillRequirementController = new SkillRequirementController(
  skillRequirementService,
  skillRequirementRouter
);

export { skillRequirementService };
export default skillRequirementRouter;
