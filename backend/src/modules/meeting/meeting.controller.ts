import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { MeetingRoomService } from '../meeting-room/meeting-room.service';
import { AuditService } from '../audit/audit.service';

@Controller('meetings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.EMPLOYEE)
export class MeetingController {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly meetingRoomService: MeetingRoomService,
    private readonly auditService: AuditService
  ) {}

  @Get('mine')
  list(@Req() req: any) {
    return this.meetingService.listForEmployee(req.user.sub);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateMeetingDto) {
    const meeting = await this.meetingService.create(req.user.companyId, req.user.sub, dto);
    await this.auditService.log({
      actorId: req.user.sub,
      actorRole: req.user.role,
      entityType: 'Meeting',
      entityId: meeting.id,
      action: 'CREATE',
      metadata: dto
    });
    return meeting;
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateMeetingDto) {
    const meeting = await this.meetingService.update(req.user.companyId, id, dto);
    await this.auditService.log({
      actorId: req.user.sub,
      actorRole: req.user.role,
      entityType: 'Meeting',
      entityId: id,
      action: 'UPDATE',
      metadata: dto
    });
    return meeting;
  }

  @Delete(':id')
  async cancel(@Req() req: any, @Param('id') id: string) {
    const result = await this.meetingService.cancel(req.user.companyId, id);
    await this.auditService.log({
      actorId: req.user.sub,
      actorRole: req.user.role,
      entityType: 'Meeting',
      entityId: id,
      action: 'DELETE'
    });
    return result;
  }

  @Get('available-rooms')
  availableRooms(@Req() req: any, @Query('start') start: string, @Query('end') end: string) {
    return this.meetingRoomService.findAvailable(req.user.companyId, new Date(start), new Date(end));
  }
}

