import { Request, Response, NextFunction } from "express";
import AuditLogRepository from "../repositories/auditLog.repository";
import { AuditActionType } from "../entities/auditLog.entity";
import UserService from "../services/user.service";
import UserRepository from "../repositories/userRepository/user.repository";
import dataSource from "../db/data-source";
import { User } from "../entities/userEntities/user.entity";
import ProjectRepository from "../repositories/projectRepository/project.repository";
import { Project } from "../entities/projectEntities/project.entity";
import { get } from "http";

export async function getProjectNameById(project_id: number): Promise<string | null> {
  const projectRepository = new ProjectRepository(dataSource.getRepository(Project));
  const project = await projectRepository.findOneById(project_id);
  return project.name;
}

export async function getActorNameByUserId(actor_user_id: string): Promise<string | null> {
  const userRepository = new UserRepository(dataSource.getRepository(User));
  const userService = new UserService(userRepository);
  const user = await userService.getUserById(actor_user_id);
  return user.name;
}

export function auditLogMiddleware(actionType: AuditActionType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor_user_id = req.user.user_id;
      let actor_name = await getActorNameByUserId(actor_user_id);
      let projectName: string;
      let change_summary: string;
      if (!actor_user_id) {
        return next();
      }
      switch (actionType) {
        case AuditActionType.CREATE_PROJECT:
          change_summary = `Created project ${req.body.name}`;
          break;
        case AuditActionType.UPDATE_PROJECT:
          change_summary = `Updated project ${req.body.name}`;
          break;
        case AuditActionType.CLOSE_PROJECT:
          change_summary = `Closed project ${req.body.name}`;
          break;
        case AuditActionType.REQUIREMENTS_UPDATE:
          let projectId: number;
          if(req.params.req){
            projectId= Number(req.params.req);
          }else{
            projectId = req.body.project;
          }
          projectName = await getProjectNameById(projectId);
          change_summary = `Updated requirements for project ${projectName}`;
          break;
        case AuditActionType.ADD_NOTE:
          projectName = await getProjectNameById(123);
          change_summary = `Added note to project ${projectName}`;
          break;
        case AuditActionType.REMOVE_NOTE:
          projectName = await getProjectNameById(123);
          change_summary = `Removed note from project ${projectName}`;
          break;
        case AuditActionType.ASSIGN_USER:
          projectName = await getProjectNameById(Number(req.params.id));
          if (Array.isArray(req.body.engineers)) {
            const userSummaries = await Promise.all(
              req.body.engineers.map(async (e) => {
                const name = await getActorNameByUserId(e.user_id);
                return `${name || "Unknown"} (${e.user_id})`;
              })
            );
            change_summary = `Assigned users [${userSummaries.join(", ")}] to project ${projectName}`;
          } else {
            change_summary = `Assigned users to project ${req.params.id}`;
          }
          break;

        case AuditActionType.REMOVE_USER:
          projectName = await getProjectNameById(Number(req.params.id));
          if (Array.isArray(req.body.engineers)) {
            const userSummaries = await Promise.all(
              req.body.engineers.map(async (e) => {
                const name = await getActorNameByUserId(e.user_id);
                return `${name || "Unknown"} (${e.user_id})`;
              })
            );
            change_summary = `Removed users [${userSummaries.join(", ")}] from project ${projectName}`;
          } else {
            change_summary = `Removed users from project ${req.params.id}`;
          }
          break;
        case AuditActionType.UPDATE_SKILLSET:
          let user = await getActorNameByUserId(req.params.id);
          change_summary = `Updated skillset of User ${user}`;
          break;
        default:
          change_summary = "Action performed";
      }

      const auditLogRepo = new AuditLogRepository();
      await auditLogRepo.create({
        actor_user_id: actor_user_id,
        actor_name: actor_name || "Unknown User",
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