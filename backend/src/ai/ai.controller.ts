import { Controller, UseGuards, Get, Post, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface IRequestUser {
  user: {
    userId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('reports')
  getReports(@Req() req: IRequestUser) {
    return this.aiService.getReports(req.user.userId);
  }

  @Post('reports/generate')
  generateWeeklyReport(@Req() req: IRequestUser) {
    return this.aiService.generateWeeklyReport(req.user.userId);
  }
}
