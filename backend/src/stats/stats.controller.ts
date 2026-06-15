import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface IRequestUser {
  user: {
    userId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('weekly-pie')
  getWeeklyPieChart(@Req() req: IRequestUser) {
    return this.statsService.getWeeklyPieChart(req.user.userId);
  }

  @Get('month-heatmap')
  getMonthHeatmap(@Req() req: IRequestUser) {
    return this.statsService.getMonthHeatmap(req.user.userId);
  }
}
