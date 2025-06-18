import express from "express";
import datasource from "../db/data-source";
import  { DesignationService } from "../services/designation.service";
import DesignationController from "../controllers/designation.controller";
import DesignationRepository from "../repositories/designationRepository/designation.repository";
import { Designation } from "../entities/userEntities/designation.entity";


const designationRouter = express.Router();

const designationRepository = new DesignationRepository(datasource.getRepository(Designation));
const designationService = new DesignationService(designationRepository);
const designationController = new DesignationController(designationService, designationRouter);

export { designationService };
export default designationRouter;

