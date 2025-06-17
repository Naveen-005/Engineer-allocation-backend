import express from "express";
import datasource from "../db/data-source";
import SkillRepository from "../repositories/skillRepository/skill.repository";
import { Skill } from "../entities/skill.entity";
import { SkillService } from "../services/skill.service";
import SkillController from "../controllers/skill.controller";

const skillRouter = express.Router();

const skillRepository = new SkillRepository(
  datasource.getRepository(Skill)
);
const skillService = new SkillService(skillRepository);
const skillController = new SkillController(
  skillService,
  skillRouter
);

export { skillService };
export default skillRouter;
