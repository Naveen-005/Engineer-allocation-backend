import AuditLogRepository from "../repositories/auditLog.repository";
import { AuditLog, AuditActionType } from "../entities/auditLog.entity";

class AuditLogService {
  private auditLogRepository: AuditLogRepository;

  constructor() {
    this.auditLogRepository = new AuditLogRepository();
  }

  async createAuditLog(data: {
    actor_user_id: string;
    action_type: AuditActionType;
    change_summary?: string;
    timestamp?: Date;
  }): Promise<AuditLog> {
    return this.auditLogRepository.create({
      ...data,
      timestamp: data.timestamp || new Date(),
    });
  }

  async getAllAuditLogs(): Promise<AuditLog[]> {
    return this.auditLogRepository.findAll();
  }

  // Uncomment and implement as needed
  // async getAuditLogById(id: number): Promise<AuditLog | null> {
  //   return this.auditLogRepository.findById(id);
  // }

  // async getAuditLogsByUserId(userId: string): Promise<AuditLog[]> {
  //   return this.auditLogRepository.findByUserId(userId);
  // }
}

export default AuditLogService;