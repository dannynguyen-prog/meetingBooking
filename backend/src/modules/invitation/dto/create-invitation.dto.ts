import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../common/enums/role.enum';

export class CreateInvitationDto {
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  companyId?: string;
}

