import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductImage } from './product-image.model';
import { CreateProductImageDto } from '../api/dto/create-product-image.dto';
import { UpdateProductImageDto } from '../api/dto/update-product-image.dto';

@Injectable()
export class ProductImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductImageDto): Promise<ProductImage> {
    return this.prisma.productImage.create({ data }) as unknown as ProductImage;
  }

  async findAll(): Promise<ProductImage[]> {
    return this.prisma.productImage.findMany({
      orderBy: { position: 'asc' },
    }) as unknown as ProductImage[];
  }

  async findByProductId(productId: string): Promise<ProductImage[]> {
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { position: 'asc' },
    }) as unknown as ProductImage[];
  }

  async findById(id: string): Promise<ProductImage | null> {
    return this.prisma.productImage.findUnique({
      where: { id },
    }) as unknown as ProductImage;
  }

  async update(id: string, data: UpdateProductImageDto): Promise<ProductImage> {
    return this.prisma.productImage.update({
      where: { id },
      data,
    }) as unknown as ProductImage;
  }

  async delete(id: string): Promise<ProductImage> {
    return this.prisma.productImage.delete({
      where: { id },
    }) as unknown as ProductImage;
  }
}
