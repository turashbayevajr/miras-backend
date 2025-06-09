import { Module } from '@nestjs/common';
import { ProductVariantController } from './api/product-variant.controller';
import { ProductVariantService } from './service/product-variant.service';
import { ProductVariantRepository } from './repository/product-variant.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProductVariantController],
  providers: [ProductVariantService, ProductVariantRepository, PrismaService],
  exports: [ProductVariantService, ProductVariantRepository]
})
export class ProductVariantModule {}
