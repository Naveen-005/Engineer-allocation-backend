import { Repository } from "typeorm";
import { AuditLog } from "../entities/auditLog.entity";
import dataSource from "../db/data-source";

class AuditLogRepository {
  private repository: Repository<AuditLog>;

  constructor() {
    this.repository = dataSource.getRepository(AuditLog);
  }

  async create(auditLog: Partial<AuditLog>): Promise<AuditLog> {
    return this.repository.save(auditLog);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.repository.find({ relations: { actor: true } });
  }
// Commented out methods are not used currently, but can be uncommented if needed in the future
//   async findById(id: number): Promise<AuditLog | null> {
//     return this.repository.findOne({
//       where: { id },
//       relations: { actor: true },
//     });
//   }

//   async findByUserId(userId: number): Promise<AuditLog[]> {
//     return this.repository.find({
//       where: { actor_user_id: userId },
//       relations: { actor: true },
//     });
//   }
}

export default AuditLogRepository;