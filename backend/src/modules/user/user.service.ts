import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  listEmployees(companyId: string) {
    return this.prisma.employee.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateEmployeeStatus(id: string, dto: UpdateUserStatusDto) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return this.prisma.employee.update({
      where: { id },
      data: { status: dto.status }
    });
  }
}

