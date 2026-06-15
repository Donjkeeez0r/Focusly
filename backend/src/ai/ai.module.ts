import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { StatsModule } from '../stats/stats.module';

@Module({
  controllers: [AiController],
  imports: [StatsModule],
  providers: [AiService],
})
export class AiModule {}
