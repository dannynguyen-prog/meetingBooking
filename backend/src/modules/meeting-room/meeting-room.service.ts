import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Injectable()
export class MeetingRoomService {
  constructor(private readonly prisma: PrismaService) {}

  list(companyId: string) {
    return this.prisma.meetingRoom.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });
  }

  create(companyId: string, dto: CreateMeetingRoomDto) {
    return this.prisma.meetingRoom.create({
      data: {
        companyId,
        ...dto
      }
    });
  }

  async update(companyId: string, id: string, dto: UpdateMeetingRoomDto) {
    const room = await this.prisma.meetingRoom.findFirst({ where: { id, companyId } });
    if (!room) {
      throw new NotFoundException('Meeting room not found');
    }
    return this.prisma.meetingRoom.update({
      where: { id },
      data: dto
    });
  }

  findAvailable(companyId: string, startTime: Date, endTime: Date) {
    return this.prisma.meetingRoom.findMany({
      where: {
        companyId,
        status: 'ACTIVE',
        meetings: {
          none: {
            AND: [
              {
                startTime: { lt: endTime }
              },
              {
                endTime: { gt: startTime }
              }
            ]
          }
        }
      }
    });
  }
}

