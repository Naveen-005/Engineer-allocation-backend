import express from "express";
import datasource from "../db/data-source";
import UserService from "../services/user.service";
import UserController from "../controllers/user.controller";
import UserRepository from "../repositories/user.repository";
import { User } from "../entities/user.entity";

const userRouter = express.Router();

const userRepository = new UserRepository(
  datasource.getRepository(User)
);
const userService = new UserService(userRepository);
const userController = new UserController(
  userService,
  userRouter
);

export { userService };
export default userRouter;
