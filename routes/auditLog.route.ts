import express from "express";
import AuditLogService from "../services/auditLog.service";
import AuditLogController from "../controllers/auditLog.controller";
import AuditLogRepository from "../repositories/auditLog.repository";

const auditLogRouter = express.Router();

const auditLogRepository = new AuditLogRepository();
const auditLogService = new AuditLogService();
const auditLogController = new AuditLogController(auditLogRouter);

export { auditLogService };
export default auditLogRouter;