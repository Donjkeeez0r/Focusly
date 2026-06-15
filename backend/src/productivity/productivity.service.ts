import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddBlocklistDto } from './dto/add-blocklist.dto';
import { SaveLogsDto } from './dto/save-logs.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductivityService {
  constructor(
    private prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async startSession(userId: string) {
    const activeSession = await this.prismaService.session.findFirst({
      where: { userId, endTime: null },
    });

    if (activeSession) {
      return activeSession;
    }

    return this.prismaService.session.create({ data: { userId } });
  }

  async endSession(userId: string) {
    const activeSession = await this.prismaService.session.findFirst({
      where: { userId, endTime: null },
    });

    if (!activeSession) {
      throw new NotFoundException('Нет активной сессии для завершения!');
    }

    return this.prismaService.session.update({
      where: { id: activeSession.id },
      data: { endTime: new Date() },
    });
  }

  async addBlockedSite(userId: string, dto: AddBlocklistDto) {
    const site = await this.prismaService.blockList.create({
      data: { userId, url: dto.url, categoryId: dto.categoryId },
    });

    const cacheKey = `user:${userId}:blocklist`;

    await this.cacheManager.del(cacheKey);

    return site;
  }

  async saveTimeLogs(userId: string, dto: SaveLogsDto) {
    const activeSession = await this.prismaService.session.findFirst({
      where: { userId, endTime: null },
    });

    const result = await this.prismaService.timeLog.createMany({
      data: dto.logs.map((log) => {
        return {
          userId,
          url: log.url,
          duration: log.duration,
          categoryId: log.categoryId,
          sessionId: activeSession ? activeSession.id : null,
        };
      }),
    });

    return {
      message: `Успешно сохранено ${result.count} записей!`,
    };
  }

  async isSiteBlocked(userId: string, url: string) {
    const cacheKey = `user:${userId}:blocklist`;

    let cachedBlocklist = await this.cacheManager.get<string[]>(cacheKey);

    if (!cachedBlocklist) {
      const dbBlocklist = await this.prismaService.blockList.findMany({
        where: { userId },
        select: { url: true },
      });

      cachedBlocklist = dbBlocklist.map((item) => item.url);

      await this.cacheManager.set(cacheKey, cachedBlocklist, 3600000);
    }

    const cleanUrl = url.replace('www.', '');

    return cachedBlocklist.includes(cleanUrl);
  }
}
