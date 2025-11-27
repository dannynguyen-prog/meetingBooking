import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { ResendInvitationDto } from './dto/resend-invitation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuditService } from '../audit/audit.service';
import { Req } from '@nestjs/common';

@Controller('invitations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SYSTEM_ADMIN, UserRole.COMPANY_ADMIN)
export class InvitationController {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly auditService: AuditService
  ) {}

  @Post()
  async create(@Req() req: any, @Body() dto: CreateInvitationDto) {
    const invite = await this.invitationService.createInvitation(dto);
    await this.auditService.log({
      actorId: req.user.sub,
      actorRole: req.user.role,
      entityType: 'Invitation',
      entityId: invite.id,
      action: 'CREATE',
      metadata: dto
    });
    return invite;
  }

  @Post('resend')
  async resend(@Req() req: any, @Body() dto: ResendInvitationDto) {
    const invite = await this.invitationService.resendInvitation(dto);
    await this.auditService.log({
      actorId: req.user.sub,
      actorRole: req.user.role,
      entityType: 'Invitation',
      entityId: invite.id,
      action: 'RESEND',
      metadata: dto
    });
    return invite;
  }
}

