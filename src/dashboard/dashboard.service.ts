import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: number) {
    const applications = await this.prisma.application.findMany({
      where: { userId },
    });

    const stats = {
      total: applications.length,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };

    applications.forEach((app) => {
      if (app.status === 'APPLIED') stats.applied++;
      if (app.status === 'INTERVIEW') stats.interview++;
      if (app.status === 'OFFER') stats.offer++;
      if (app.status === 'REJECTED') stats.rejected++;
    });

    return stats;
  }
}