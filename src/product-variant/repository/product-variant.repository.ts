import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductVariant } from './product-variant.model';
import { CreateProductVariantDto } from '../api/dto/create-product-variant.dto';
import { UpdateProductVariantDto } from '../api/dto/update-product-variant.dto';

@Injectable()
export class ProductVariantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductVariantDto): Promise<ProductVariant> {
    return this.prisma.productVariant.create({ data }) as unknown as ProductVariant;
  }
async findAll(): Promise<ProductVariant[]> {
  return this.prisma.productVariant.findMany({
    where: { deletedAt: null },
    orderBy: {
      size: {
        label_kk: 'asc',
      },
    },
    include: {
      size: true,
      color: true,
    },
  }) as unknown as ProductVariant[];
}

async findByProductId(productId: string): Promise<ProductVariant[]> {
  return this.prisma.productVariant.findMany({
    where: {
      productId,
      deletedAt: null,
    },
    orderBy: {
      size: {
        label_kk: 'asc',
      },
    },
    include: {
      size: true,
      color: true,
    },
  }) as unknown as ProductVariant[];
}

  async findById(id: string): Promise<ProductVariant | null> {
    return this.prisma.productVariant.findFirst({
      where: { id, deletedAt: null },
    }) as unknown as ProductVariant;
  }

  async update(id: string, data: UpdateProductVariantDto): Promise<ProductVariant> {
    return this.prisma.productVariant.update({
      where: { id },
      data,
    }) as unknown as ProductVariant;
  }

  async delete(id: string): Promise<ProductVariant> {
    return this.prisma.productVariant.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as unknown as ProductVariant;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const res = await this.prisma.productVariant.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
    return res.count;
  }
}
