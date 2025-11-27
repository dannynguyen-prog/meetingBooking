import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ResendInvitationDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  companyId?: string;
}

