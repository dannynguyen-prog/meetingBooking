import { IsString, MinLength } from 'class-validator';

export class CompleteSignupDto {
  @IsString()
  token: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(8)
  password: string;
}

