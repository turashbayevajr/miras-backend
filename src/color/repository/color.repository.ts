import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateColorDto } from '../api/dto/create-color.dto';
import { UpdateColorDto } from '../api/dto/update-color.dto';
import { Color } from './color.model';

@Injectable()
export class ColorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateColorDto): Promise<Color> {
    return this.prisma.color.create({ data }) as unknown as Color;
  }

  async findAll(): Promise<Color[]> {
    return this.prisma.color.findMany({
      orderBy: { label_kk: 'asc' },
    }) as unknown as Color[];
  }

  async findById(id: string): Promise<Color | null> {
    return this.prisma.color.findUnique({
      where: { id },
    }) as unknown as Color;
  }

  async update(id: string, data: UpdateColorDto): Promise<Color> {
    return this.prisma.color.update({
      where: { id },
      data,
    }) as unknown as Color;
  }

  async delete(id: string): Promise<Color> {
    return this.prisma.color.delete({
      where: { id },
    }) as unknown as Color;
  }
}
