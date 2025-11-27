import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingRoomDto } from './create-meeting-room.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateMeetingRoomDto extends PartialType(CreateMeetingRoomDto) {
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE';
}

