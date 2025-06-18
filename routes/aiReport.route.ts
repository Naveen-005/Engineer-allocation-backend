// src/routes/aiReport.routes.ts
import express from "express";
import ReportController from "../controllers/aiReport.controller";
import { ReportService } from "../services/aiReport.services";

const aiReportRouter = express.Router();
const reportService = new ReportService();
new ReportController(reportService, aiReportRouter); 


export default aiReportRouter;
export { reportService };
