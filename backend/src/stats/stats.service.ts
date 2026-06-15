import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prismaService: PrismaService) {}

  async getWeeklyPieChart(userId: string) {
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const aggregatedLogs = await this.prismaService.timeLog.groupBy({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
        categoryId: { not: null },
      },
      by: ['categoryId'],
      _sum: { duration: true },
    });

    const categoryIds = aggregatedLogs.map((log) => log.categoryId as string);

    const categories = await this.prismaService.category.findMany({
      where: {
        id: { in: categoryIds },
      },
    });

    return aggregatedLogs.map((log) => {
      const cat = categories.find((c) => c.id === log.categoryId);
      return {
        name: cat?.name || 'Неизвестно',
        color: cat?.color || '#ccc',
        totalSeconds: log._sum.duration || 0,
      };
    });
  }

  async getMonthHeatmap(userId: string) {
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await this.prismaService.timeLog.findMany({
      where: { userId, createdAt: { gte: thirtyDaysAgo } },
      select: { duration: true, createdAt: true },
    });

    const dailyStats: Record<string, number> = {};

    logs.forEach((log) => {
      const dateStr = log.createdAt.toISOString().split('T')[0];

      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = 0;
      }

      dailyStats[dateStr] += log.duration;
    });

    return Object.keys(dailyStats).map((date) => {
      return {
        date,
        totalSeconds: dailyStats[date],
      };
    });
  }
}
