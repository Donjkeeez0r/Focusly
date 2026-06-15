import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

interface IRequestUser {
  user: {
    userId: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategories(@Req() req: IRequestUser) {
    return this.categoriesService.getCategories(req.user.userId);
  }

  @Post()
  createCategory(@Req() req: IRequestUser, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(req.user.userId, dto);
  }

  @Delete(':id')
  deleteCategory(@Req() req: IRequestUser, @Param('id') id: string) {
    return this.categoriesService.deleteCategory(req.user.userId, id);
  }
}
