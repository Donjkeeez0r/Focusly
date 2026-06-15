import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductivityModule } from './productivity/productivity.module';
import { StatsModule } from './stats/stats.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { AiModule } from './ai/ai.module';
import KeyvRedis from '@keyv/redis';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    ProductivityModule,
    StatsModule,
    CategoriesModule,
    CacheModule.register({
      stores: [new KeyvRedis('redis://localhost:6379')],
      isGlobal: true,
    }),
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
