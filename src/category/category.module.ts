import { Module } from '@nestjs/common';
import { CategoryController } from './api/category.controller';
import { CategoryService } from './service/category.service';
import { CategoryRepository } from './repository/category.repository';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository]
})
export class CategoryModule {}
