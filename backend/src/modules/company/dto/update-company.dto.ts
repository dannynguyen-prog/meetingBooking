import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE';
}

