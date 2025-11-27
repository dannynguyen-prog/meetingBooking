import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { AuditService } from '../audit/audit.service';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.COMPANY_ADMIN)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly auditService: AuditService
  ) {}

  @Get()
  list(@Req() req: any) {
    return this.userService.listEmployees(req.user.companyId);
  }

  @Patch(':id/status')
  async updateStatus(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    const employee = await this.userService.updateEmployeeStatus(id, dto);
    await this.auditService.log({
      actorId: req.user.sub,
      actorRole: req.user.role,
      entityType: 'Employee',
      entityId: id,
      action: 'UPDATE_STATUS',
      metadata: dto
    });
    return employee;
  }
}

