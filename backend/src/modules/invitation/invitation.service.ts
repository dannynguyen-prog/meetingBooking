import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { ResendInvitationDto } from './dto/resend-invitation.dto';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { EmailService } from '../notification/email.service';
import { UserRole } from '../../common/enums/role.enum';

interface CreateInvitationOptions extends CreateInvitationDto {
  expiresInHours?: number;
}

@Injectable()
export class InvitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) {}

  async createInvitation(dto: CreateInvitationOptions) {
    if (dto.role !== UserRole.SYSTEM_ADMIN && !dto.companyId) {
      throw new UnauthorizedException('companyId is required for non-system invitations');
    }

    const hours = dto.expiresInHours ?? this.configService.get<number>('invitationExpiryHours');
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const invitation = await this.prisma.invitationToken.create({
      data: {
        email: dto.email,
        role: dto.role,
        companyId: dto.companyId,
        token,
        expiresAt
      }
    });

    await this.sendEmail(invitation.email, invitation.token, invitation.role, invitation.companyId);
    return invitation;
  }

  async resendInvitation(dto: ResendInvitationDto) {
    const existing = await this.prisma.invitationToken.findFirst({
      where: { email: dto.email },
      orderBy: { createdAt: 'desc' }
    });

    if (!existing) {
      throw new NotFoundException('Invitation not found');
    }

    if (existing.acceptedAt) {
      throw new UnauthorizedException('Invitation already accepted');
    }

    if (existing.expiresAt > new Date()) {
      throw new UnauthorizedException('Existing invitation still valid');
    }

    return this.createInvitation({
      email: existing.email,
      role: existing.role as UserRole,
      companyId: existing.companyId ?? dto.companyId
    });
  }

  async consumeToken(token: string) {
    const invitation = await this.prisma.invitationToken.findUnique({ where: { token } });
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    if (invitation.acceptedAt) {
      throw new UnauthorizedException('Invitation already used');
    }
    if (invitation.expiresAt < new Date()) {
      throw new UnauthorizedException('Invitation expired');
    }

    await this.prisma.invitationToken.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() }
    });

    return invitation;
  }

  private async sendEmail(email: string, token: string, role: string, companyId?: string) {
    const appUrl = companyId ? this.configService.get<string>('mobileAppUrl') : this.configService.get<string>('appUrl');
    const inviteLink = `${appUrl}/invite?token=${token}`;
    await this.emailService.sendInvitationEmail(email, inviteLink, role);
  }
}

