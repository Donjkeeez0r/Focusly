import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductivityService } from './productivity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddBlocklistDto } from './dto/add-blocklist.dto';
import { SaveLogsDto } from './dto/save-logs.dto';

interface IRequestUser {
  user: {
    userId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('productivity')
export class ProductivityController {
  constructor(private readonly productivityService: ProductivityService) {}

  @Post('session/start')
  startSession(@Req() req: IRequestUser) {
    return this.productivityService.startSession(req.user.userId);
  }

  @Post('session/end')
  endSession(@Req() req: IRequestUser) {
    return this.productivityService.endSession(req.user.userId);
  }

  @Get('session/active')
  getActiveSession(@Req() req: IRequestUser) {
    return this.productivityService.getActiveSession(req.user.userId);
  }

  @Get('sessions')
  getSessions(@Req() req: IRequestUser) {
    return this.productivityService.getSessions(req.user.userId);
  }

  @Get('blocklist')
  getBlocklist(@Req() req: IRequestUser) {
    return this.productivityService.getBlocklist(req.user.userId);
  }

  @Post('blocklist')
  addBlockedSite(@Req() req: IRequestUser, @Body() dto: AddBlocklistDto) {
    return this.productivityService.addBlockedSite(req.user.userId, dto);
  }

  @Delete('blocklist/:id')
  deleteBlockedSite(@Req() req: IRequestUser, @Param('id') id: string) {
    return this.productivityService.deleteBlockedSite(req.user.userId, id);
  }

  @Get('logs')
  getLogs(@Req() req: IRequestUser) {
    return this.productivityService.getLogs(req.user.userId);
  }

  @Post('logs')
  saveLogs(@Req() req: IRequestUser, @Body() dto: SaveLogsDto) {
    return this.productivityService.saveTimeLogs(req.user.userId, dto);
  }

  @Get('check-site')
  async checkSite(@Req() req: IRequestUser, @Query('url') url: string) {
    const isBlocked = await this.productivityService.isSiteBlocked(
      req.user.userId,
      url,
    );

    return {
      url,
      isBlocked,
    };
  }
}
