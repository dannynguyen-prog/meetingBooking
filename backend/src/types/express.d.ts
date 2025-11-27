import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      sub: string;
      role: string;
      companyId?: string;
    };
    auditMeta?: {
      entityType: string;
      entityId?: string;
      action: string;
      metadata?: Record<string, unknown>;
    };
  }
}

