import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { AuditService } from '../audit/audit.service';
import { Req } from '@nestjs/common';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SYSTEM_ADMIN)
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly auditService: AuditService
  ) {}

  @Get()
  list() {
    return this.companyService.listCompanies();
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateCompanyDto) {
    const company = await this.companyService.createCompany(dto);
    await this.auditService.log({
      actorId: req.user.sub,
      actorRole: req.user.role,
      entityType: 'Company',
      entityId: company.id,
      action: 'CREATE',
      metadata: dto
    });
    return company;
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    const company = await this.companyService.updateCompany(id, dto);
    await this.auditService.log({
      actorId: req.user.sub,
      actorRole: req.user.role,
      entityType: 'Company',
      entityId: id,
      action: 'UPDATE',
      metadata: dto
    });
    return company;
  }

  @Get(':id/admins')
  admins(@Param('id') id: string) {
    return this.companyService.listAdmins(id);
  }
}

