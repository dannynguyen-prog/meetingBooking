import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { UserModule } from './modules/user/user.module';
import { MeetingRoomModule } from './modules/meeting-room/meeting-room.module';
import { MeetingModule } from './modules/meeting/meeting.module';
import { InvitationModule } from './modules/invitation/invitation.module';
import configuration from './config/configuration';
import validationSchema from './config/validation';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema
    }),
    PrismaModule,
    AuditModule,
    AuthModule,
    CompanyModule,
    UserModule,
    MeetingRoomModule,
    MeetingModule,
    InvitationModule
  ]
})
export class AppModule {}

