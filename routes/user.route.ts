import express from "express";
import datasource from "../db/data-source";
import UserService from "../services/user.service";
import UserController from "../controllers/user.controller";
import UserRepository from "../repositories/userRepository/user.repository";
import { User } from "../entities/userEntities/user.entity";
import UserSkillRepository from "../repositories/userSkill.repository";
import { UserSkill } from "../entities/userEntities/userSkill.entity";
import UserSkillService from "../services/userSkill.service";

const userRouter = express.Router();

const userRepository = new UserRepository(datasource.getRepository(User));
const userService = new UserService(userRepository);
const userSkillRepository=new UserSkillRepository(datasource.getRepository(UserSkill))
const userSkillService= new UserSkillService(userSkillRepository,userRepository)
const userController = new UserController(userService,userSkillService, userRouter);

export { userService };
export default userRouter;
