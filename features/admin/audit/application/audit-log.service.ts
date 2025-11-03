// Application layer - Audit log use cases
import type {
  AuditLog,
  AuditLogFilter,
  AuditLogListItem,
} from '../domain/types';

export interface AuditLogRepository {
  findAll(filter?: AuditLogFilter): Promise<AuditLogListItem[]>;
  findById(id: string): Promise<AuditLog | null>;
  create(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog>;
}

export class AuditLogService {
  constructor(private repository: AuditLogRepository) {}

  async getAuditLogs(filter?: AuditLogFilter): Promise<AuditLogListItem[]> {
    return this.repository.findAll(filter);
  }

  async getAuditLogById(id: string): Promise<AuditLog | null> {
    return this.repository.findById(id);
  }

  async logAction(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    return this.repository.create(data);
  }
}
