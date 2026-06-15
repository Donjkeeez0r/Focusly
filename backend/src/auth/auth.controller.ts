import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Response } from 'express';

interface GoogleAuthRequest {
  user: {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
  };
}

interface JwtAuthRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: GoogleAuthRequest,
    @Res() res: Response,
  ) {
    const { access_token } = await this.authService.googleLogin(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    return res.redirect(
      `${frontendUrl}/auth/callback?access_token=${encodeURIComponent(access_token)}`,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: JwtAuthRequest) {
    return this.authService.getMe(req.user.userId);
  }
}
