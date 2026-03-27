import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateApplicationDto) {
    return this.prisma.application.create({
      data: {
        company: dto.company,
        role: dto.role,
        status: (dto.status || 'APPLIED').toUpperCase(),
        priorityScore: dto.priorityScore || 'MEDIUM',
        notes: dto.notes || null,
        appliedDate: dto.appliedDate ? new Date(dto.appliedDate) : new Date(),
        targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: number) {
    const app = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!app) throw new NotFoundException('Data missing from mission logs');
    if (app.userId !== userId) throw new ForbiddenException('Unauthorized trajectory access');
    
    return app;
  }

  async remove(id: string, userId: number) {
    const app = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!app) throw new NotFoundException('Data missing from mission logs');
    if (app.userId !== userId) throw new ForbiddenException('Unauthorized trajectory access');

    return this.prisma.application.delete({
      where: { id },
    });
  }

  async update(id: string, userId: number, dto: Partial<CreateApplicationDto>) {
    const app = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!app) throw new NotFoundException('Data missing from mission logs');
    if (app.userId !== userId) throw new ForbiddenException('Unauthorized trajectory access');

    return this.prisma.application.update({
      where: { id },
      data: {
        company: dto.company,
        role: dto.role,
        status: dto.status?.toUpperCase(),
        priorityScore: dto.priorityScore?.toUpperCase(),
        notes: dto.notes === undefined ? undefined : (dto.notes || null),
        appliedDate: dto.appliedDate ? new Date(dto.appliedDate) : undefined,
        targetDate: dto.targetDate === undefined ? undefined : (dto.targetDate ? new Date(dto.targetDate) : null),
      },
    });
  }
}