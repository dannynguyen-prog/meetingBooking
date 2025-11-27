import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { MeetingRoomModule } from '../meeting-room/meeting-room.module';
import { EmailModule } from '../notification/email.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [MeetingRoomModule, EmailModule, AuditModule],
  controllers: [MeetingController],
  providers: [MeetingService]
})
export class MeetingModule {}

