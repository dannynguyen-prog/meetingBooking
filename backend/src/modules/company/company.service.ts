import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  listCompanies() {
    return this.prisma.company.findMany({
      include: {
        admins: true,
        employees: true,
        rooms: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  createCompany(dto: CreateCompanyDto) {
    return this.prisma.company.create({ data: dto });
  }

  async updateCompany(id: string, dto: UpdateCompanyDto) {
    await this.assertExists(id);
    return this.prisma.company.update({
      where: { id },
      data: dto
    });
  }

  async setStatus(id: string, status: 'ACTIVE' | 'INACTIVE') {
    await this.assertExists(id);
    return this.prisma.company.update({
      where: { id },
      data: { status }
    });
  }

  listAdmins(companyId: string) {
    return this.prisma.companyAdmin.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });
  }

  private async assertExists(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
  }
}

