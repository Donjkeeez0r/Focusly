import { Controller, UseGuards, Get } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('reports')
  getWeeklyReports() {
    return this.aiService.generateWeeklyReports();
  }
}
