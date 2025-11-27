import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { EmailService } from '../notification/email.service';

@Injectable()
export class MeetingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService
  ) {}

  listForEmployee(employeeId: string) {
    return this.prisma.meeting.findMany({
      where: {
        OR: [{ createdByEmployeeId: employeeId }, { guests: { some: { employeeId } } }]
      },
      include: { room: true, guests: true },
      orderBy: { startTime: 'asc' }
    });
  }

  async create(companyId: string, employeeId: string, dto: CreateMeetingDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    this.validateTimes(start, end);
    await this.ensureRoom(companyId, dto.roomId);
    await this.ensureAvailability(dto.roomId, start, end);

    const meeting = await this.prisma.meeting.create({
      data: {
        companyId,
        createdByEmployeeId: employeeId,
        roomId: dto.roomId,
        title: dto.title,
        startTime: start,
        endTime: end,
        details: dto.details,
        guests: {
          create: dto.guestIds.map((employeeId) => ({
            employeeId
          }))
        }
      },
      include: {
        guests: { include: { employee: true } },
        room: true,
        createdBy: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    await this.sendMeetingNotifications(meeting, 'created');
    return meeting;
  }

  async update(companyId: string, meetingId: string, dto: UpdateMeetingDto) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id: meetingId, companyId },
      include: { guests: true }
    });
    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    const start = dto.startTime ? new Date(dto.startTime) : meeting.startTime;
    const end = dto.endTime ? new Date(dto.endTime) : meeting.endTime;
    this.validateTimes(start, end);

    const roomId = dto.roomId ?? meeting.roomId;
    await this.ensureRoom(companyId, roomId);
    await this.ensureAvailability(roomId, start, end, meeting.id);

    await this.prisma.meetingGuest.deleteMany({ where: { meetingId: meeting.id } });

    const updated = await this.prisma.meeting.update({
      where: { id: meeting.id },
      data: {
        roomId,
        title: dto.title ?? meeting.title,
        startTime: start,
        endTime: end,
        details: dto.details ?? meeting.details,
        guests: {
          create: (dto.guestIds ?? meeting.guests.map((g) => g.employeeId)).map((employeeId) => ({
            employeeId
          }))
        }
      },
      include: {
        guests: { include: { employee: true } },
        room: true,
        createdBy: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    await this.sendMeetingNotifications(updated, 'updated');
    return updated;
  }

  async cancel(companyId: string, meetingId: string) {
    const meeting = await this.prisma.meeting.findFirst({
      where: { id: meetingId, companyId },
      include: {
        guests: { include: { employee: true } },
        room: true,
        createdBy: {
          select: { firstName: true, lastName: true }
        }
      }
    });
    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    await this.prisma.meeting.delete({ where: { id: meeting.id } });
    await this.sendMeetingNotifications(meeting, 'cancelled');
    return { success: true };
  }

  private validateTimes(start: Date, end: Date) {
    if (start >= end) {
      throw new BadRequestException('End time must be after start time');
    }
  }

  private async ensureRoom(companyId: string, roomId: string) {
    const room = await this.prisma.meetingRoom.findFirst({ where: { id: roomId, companyId } });
    if (!room) {
      throw new NotFoundException('Meeting room not found for this company');
    }
  }

  private async ensureAvailability(
    roomId: string,
    start: Date,
    end: Date,
    excludeMeetingId?: string
  ) {
    const conflict = await this.prisma.meeting.findFirst({
      where: {
        roomId,
        id: excludeMeetingId ? { not: excludeMeetingId } : undefined,
        startTime: { lt: end },
        endTime: { gt: start }
      }
    });
    if (conflict) {
      throw new BadRequestException('Meeting room is not available for the selected time');
    }
  }

  private async sendMeetingNotifications(
    meeting: any,
    action: 'created' | 'updated' | 'cancelled'
  ) {
    const subject = `Meeting ${action}: ${meeting.title}`;
    const html = this.emailService.buildMeetingHtml({
      title: meeting.title,
      roomName: meeting.room?.name ?? 'Unassigned',
      startTime: meeting.startTime.toISOString(),
      endTime: meeting.endTime.toISOString(),
      ownerName: meeting.createdBy?.firstName ?? 'Organizer',
      action
    });

    const recipients = meeting.guests.map((guest) => guest.employee.email).filter(Boolean);

    await Promise.all(
      recipients.map((email: string) =>
        this.emailService.sendMeetingUpdateEmail(email, subject, html)
      )
    );
  }
}
