import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSizeDto } from '../api/dto/create-size.dto';
import { UpdateSizeDto } from '../api/dto/update-size.dto';
import { Size } from './size.model';

@Injectable()
export class SizeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSizeDto): Promise<Size> {
    return this.prisma.size.create({ data }) as unknown as Size;
  }

  async findAll(): Promise<Size[]> {
    return this.prisma.size.findMany({
      orderBy: { label: 'asc' },
    }) as unknown as Size[];
  }

  async findById(id: string): Promise<Size | null> {
    return this.prisma.size.findUnique({
      where: { id },
    }) as unknown as Size;
  }

  async update(id: string, data: UpdateSizeDto): Promise<Size> {
    return this.prisma.size.update({
      where: { id },
      data,
    }) as unknown as Size;
  }

  async delete(id: string): Promise<Size> {
    return this.prisma.size.delete({
      where: { id },
    }) as unknown as Size;
  }
}
