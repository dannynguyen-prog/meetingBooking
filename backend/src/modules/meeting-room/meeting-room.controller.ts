import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { AuditService } from '../audit/audit.service';

@Controller('meeting-rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.COMPANY_ADMIN)
export class MeetingRoomController {
  constructor(
    private readonly meetingRoomService: MeetingRoomService,
    private readonly auditService: AuditService
  ) {}

  @Get()
  list(@Req() req: any) {
    return this.meetingRoomService.list(req.user.companyId);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateMeetingRoomDto) {
    const room = await this.meetingRoomService.create(req.user.companyId, dto);
    await this.auditService.log({
      actorId: req.user.sub,
      actorRole: req.user.role,
      entityType: 'MeetingRoom',
      entityId: room.id,
      action: 'CREATE',
      metadata: dto
    });
    return room;
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateMeetingRoomDto) {
    const room = await this.meetingRoomService.update(req.user.companyId, id, dto);
    await this.auditService.log({
      actorId: req.user.sub,
      actorRole: req.user.role,
      entityType: 'MeetingRoom',
      entityId: id,
      action: 'UPDATE',
      metadata: dto
    });
    return room;
  }
}

