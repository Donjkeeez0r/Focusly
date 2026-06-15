import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  getCategories(userId: string) {
    return this.prismaService.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  createCategory(userId: string, dto: CreateCategoryDto) {
    return this.prismaService.category.create({
      data: {
        userId,
        name: dto.name,
        color: dto.color,
      },
    });
  }

  async deleteCategory(userId: string, id: string) {
    const category = await this.prismaService.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена!');
    }

    await this.prismaService.category.delete({
      where: { id },
    });

    return { message: 'Категория удалена!' };
  }
}
