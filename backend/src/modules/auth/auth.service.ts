import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CompleteSignupDto } from './dto/complete-signup.dto';
import { InvitationService } from '../invitation/invitation.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly invitationService: InvitationService,
    private readonly configService: ConfigService
  ) {}

  async login(dto: LoginDto) {
    const user =
      (await this.prisma.companyAdmin.findUnique({ where: { email: dto.email } })) ||
      (await this.prisma.employee.findUnique({ where: { email: dto.email } }));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const role = 'companyId' in user ? UserRole.COMPANY_ADMIN : UserRole.EMPLOYEE;

    await this.prisma.$transaction([
      this.prisma.companyAdmin.updateMany({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      }),
      this.prisma.employee.updateMany({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      })
    ]);

    const payload = { sub: user.id, role, companyId: user.companyId };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        role,
        companyId: user.companyId,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };
  }

  async completeSignup(dto: CompleteSignupDto) {
    const invitation = await this.invitationService.consumeToken(dto.token);
    const passwordHash = await bcrypt.hash(dto.password, 10);

    if (invitation.role === UserRole.COMPANY_ADMIN) {
      const admin = await this.prisma.companyAdmin.create({
        data: {
          companyId: invitation.companyId!,
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: invitation.email,
          passwordHash
        }
      });
      return admin;
    }

    const employee = await this.prisma.employee.create({
      data: {
        companyId: invitation.companyId!,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: invitation.email,
        passwordHash
      }
    });
    return employee;
  }

  async resendInvitation(email: string, role: UserRole, companyId?: string) {
    const hours = this.configService.get<number>('invitationExpiryHours');
    return this.invitationService.createInvitation({
      email,
      role,
      companyId,
      expiresInHours: hours
    });
  }
}

