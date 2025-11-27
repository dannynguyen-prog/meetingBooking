import { IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  industry?: string;
}

