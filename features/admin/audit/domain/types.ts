// Domain types for Audit Logs

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId?: string;
  actorRole?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface AuditLogFilter {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  entityType?: string;
  action?: string;
  search?: string;
}

export interface AuditLogListItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userName?: string;
  actorRole?: string;
  timestamp: Date;
}
