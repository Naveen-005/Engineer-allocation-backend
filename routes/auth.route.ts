import express from "express";
import AuthController from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { userService } from "./user.route";


const authRouter= express.Router();

const authService = new AuthService(userService);
const authController = new AuthController(authService,authRouter)


export {authRouter}