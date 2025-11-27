import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { EmailModule } from '../notification/email.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [EmailModule, AuditModule],
  controllers: [InvitationController],
  providers: [InvitationService],
  exports: [InvitationService]
})
export class InvitationModule {}

