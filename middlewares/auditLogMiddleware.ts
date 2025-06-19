import { Request, Response, NextFunction } from "express";
import AuditLogRepository from "../repositories/auditLog.repository";
import { AuditActionType } from "../entities/auditLog.entity";

export function auditLogMiddleware(actionType: AuditActionType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor_user_id = req.user.user_id;
      let change_summary: string;
      if (!actor_user_id) {
        return next();
      }
      switch (actionType) {
        case AuditActionType.CREATE_PROJECT:
          change_summary = `Created project ${req.body.name}`;
          break;
        case AuditActionType.UPDATE_PROJECT:
          change_summary = `Updated project ${req.params.id}`;
          break;
        case AuditActionType.CLOSE_PROJECT:
          change_summary = `Closed project ${req.body.name}`;
          break;
        case AuditActionType.REQUIREMENTS_UPDATE:
          change_summary = `Updated requirements for project ${req.body.project}`;
          break;
        case AuditActionType.ADD_NOTE:
          change_summary = `Added note to project ${req.params.projectId}`;
          break;
        case AuditActionType.REMOVE_NOTE:
          change_summary = `Removed note from project ${req.params.projectId}`;
          break;
        case AuditActionType.ASSIGN_USER:
          if (Array.isArray(req.body.engineers)) {
            const users = req.body.engineers.map(e => e.user_id).join(", ");
            change_summary = `Assigned users [${users}] to project ${req.params.id}`;
          } else {
            change_summary = `Assigned users to project ${req.params.id}`;
          }
          break;
        case AuditActionType.REMOVE_USER:
          if (Array.isArray(req.body.engineers)) {
            const users = req.body.engineers.join(", ");
            change_summary = `Removed users [${users}] from project ${req.params.id}`;
          } else {
            change_summary = `Removed users from project ${req.params.id}`;
          }
          break;
        case AuditActionType.UPDATE_SKILLSET:
          change_summary = `Updated skillset of User ${req.params.id}`;
          break;
        default:
          change_summary = "Action performed";
      }

      const auditLogRepo = new AuditLogRepository();
      await auditLogRepo.create({
        actor_user_id: actor_user_id,
        action_type: actionType,
        timestamp: new Date(),
        change_summary: change_summary,
      });

      next();
    } catch (error) {
      console.error("Audit log error:", error);
      next();
    }
  };
}