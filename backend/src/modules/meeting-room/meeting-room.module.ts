import { Module } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { MeetingRoomController } from './meeting-room.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [MeetingRoomController],
  providers: [MeetingRoomService],
  exports: [MeetingRoomService]
})
export class MeetingRoomModule {}

