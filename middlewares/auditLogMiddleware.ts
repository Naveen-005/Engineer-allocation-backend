import { Request, Response, NextFunction } from "express";
import AuditLogRepository from "../repositories/auditLog.repository";
import { AuditActionType } from "../entities/auditLog.entity";

export function auditLogMiddleware(actionType: AuditActionType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor_user_id = req.user?.user_id;
      const change_summary = req.body;
      if (!actor_user_id) {
        // Optionally skip logging if no user is found
        return next();
      }

      const auditLogRepo = new AuditLogRepository();
      await auditLogRepo.create({
        actor_user_id: Number(actor_user_id),
        action_type: actionType,
        //Entire body of the request is logged as change summary
        // You can customize this to log only specific fields if needed
        change_summary: JSON.stringify(change_summary), // Convert the change summary to a string
      });

      next();
    } catch (error) {
      console.error("Audit log error:", error);
      next();
    }
  };
}