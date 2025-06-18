import { Request, Response, NextFunction, Router } from "express";
import AuditLogService from "../services/auditLog.service";

export default class AuditLogController {
  private auditLogService: AuditLogService;

  constructor(router: Router) {
    this.auditLogService = new AuditLogService();

    router.get("/", this.getAllAuditLogs.bind(this));
    // Add more routes as needed, e.g.:
    // router.get("/audit-logs/:id", this.getAuditLogById.bind(this));
  }

  async getAllAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await this.auditLogService.getAllAuditLogs();
      res.status(200).json({ data: logs });
    } catch (error) {
      next(error);
    }
  }

  // Uncomment and implement as needed
  // async getAuditLogById(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const id = Number(req.params.id);
  //     const log = await this.auditLogService.getAuditLogById(id);
  //     if (!log) {
  //       return res.status(404).json({ message: "Audit log not found" });
  //     }
  //     res.status(200).json({ data: log });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}