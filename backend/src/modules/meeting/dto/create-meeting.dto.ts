import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  title: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsString()
  roomId: string;

  @IsArray()
  guestIds: string[];
}

