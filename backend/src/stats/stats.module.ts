import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  controllers: [StatsController],
  exports: [StatsService],
  providers: [StatsService],
})
export class StatsModule {}
