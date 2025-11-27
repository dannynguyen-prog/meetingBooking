import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateMeetingRoomDto {
  @IsString()
  name: string;

  @IsInt()
  capacity: number;

  @IsInt()
  @Min(0)
  @Max(23)
  availableFrom: number;

  @IsInt()
  @Min(0)
  @Max(23)
  availableTo: number;

  @IsOptional()
  @IsString()
  location?: string;
}

