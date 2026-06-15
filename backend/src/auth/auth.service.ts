import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(googleUser: {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
  }) {
    let existingUser = await this.prismaService.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    if (!existingUser) {
      existingUser = await this.prismaService.user.findUnique({
        where: { email: googleUser.email },
      });
    }

    if (!existingUser) {
      existingUser = await this.prismaService.user.create({
        data: {
          googleId: googleUser.googleId,
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
        },
      });
    } else if (!existingUser.googleId) {
      existingUser = await this.prismaService.user.update({
        where: { id: existingUser.id },
        data: {
          googleId: googleUser.googleId,
          name: googleUser.name,
          avatar: googleUser.avatar,
        },
      });
    }

    return this.generateToken(existingUser);
  }

  getMe(userId: string) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
      },
    });
  }

  private generateToken(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
