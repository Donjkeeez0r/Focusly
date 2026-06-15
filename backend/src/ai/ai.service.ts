import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatsService } from '../stats/stats.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AiService {
  private genAi: GoogleGenerativeAI;
  private readonly logger = new Logger(AiService.name);

  constructor(
    private prismaService: PrismaService,
    private statsService: StatsService,
    private configService: ConfigService,
  ) {
    this.genAi = new GoogleGenerativeAI(
      this.configService.getOrThrow('GEMINI_API_KEY'),
    );
  }

  @Cron('59 23 * * 0')
  async generateWeeklyReports() {
    this.logger.log('Начинаю генерацию еженедельных отчетов!');

    const users = await this.prismaService.user.findMany();

    for (const user of users) {
      try {
        await this.generateWeeklyReport(user.id, true);
      } catch (error) {
        console.error(error);
      }
    }
  }

  getReports(userId: string) {
    return this.prismaService.aiReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async generateWeeklyReport(userId: string, skipEmptyStats = false) {
    const weeklyStats = await this.statsService.getWeeklyPieChart(userId);

    if (weeklyStats.length === 0) {
      if (skipEmptyStats) {
        return null;
      }

      throw new NotFoundException('Нет статистики для генерации отчета!');
    }

    let statsText = '';

    weeklyStats.forEach((stat) => {
      const hours = (stat.totalSeconds / 3600).toFixed(1);

      statsText += `- ${stat.name}: ${hours} часов\n`;
    });

    const prompt = `
      Ты — строгий, но дружелюбный ментор по продуктивности.
      Вот статистика пользователя за прошедшую неделю:
      ${statsText}
      
      Проанализируй эти цифры. Напиши короткий, мотивирующий отзыв (максимум 4 предложения). 
      Если он много работал — похвали. Если много отдыхал — дай легкий пинок. Обращайся на "ты".
    `;

    const model = this.genAi.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const result = await model.generateContent(prompt);

    const feedback = result.response.text();

    return this.prismaService.aiReport.create({
      data: {
        userId,
        feedback,
      },
    });
  }
}
