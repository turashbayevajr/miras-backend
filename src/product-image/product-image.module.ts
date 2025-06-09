import { Module } from '@nestjs/common';
import { ProductImageController } from './api/product-image.controller';
import { ProductImageService } from './service/product-image.service';
import { ProductImageRepository } from './repository/product-image.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProductImageController],
  providers: [ProductImageService, ProductImageRepository, PrismaService],
  exports: [ProductImageService, ProductImageRepository]
})
export class ProductImageModule {}
