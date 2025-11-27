import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuditLogPayload {
  actorId?: string;
  actorRole?: string;
  entityType: string;
  entityId?: string;
  action: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(payload: AuditLogPayload) {
    await this.prisma.auditLog.create({
      data: {
        actorId: payload.actorId,
        actorRole: payload.actorRole,
        entityType: payload.entityType,
        entityId: payload.entityId,
        action: payload.action,
        metadata: payload.metadata ?? undefined
      }
    });
  }
}

