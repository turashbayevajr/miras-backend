import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AgeGroup } from './age-group.model';
import { CreateAgeGroupDto } from '../api/dto/create-age-group.dto';
import { UpdateAgeGroupDto } from '../api/dto/update-age-group.dto';

@Injectable()
export class AgeGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAgeGroupDto): Promise<AgeGroup> {
    return this.prisma.ageGroup.create({ data }) as unknown as AgeGroup;
  }

  async findAll(): Promise<AgeGroup[]> {
    return this.prisma.ageGroup.findMany({
      orderBy: { label_kk: 'asc' },
    }) as unknown as AgeGroup[];
  }

  async findById(id: string): Promise<AgeGroup | null> {
    return this.prisma.ageGroup.findUnique({
      where: { id },
    }) as unknown as AgeGroup;
  }

  async update(id: string, data: UpdateAgeGroupDto): Promise<AgeGroup> {
    return this.prisma.ageGroup.update({
      where: { id },
      data,
    }) as unknown as AgeGroup;
  }

  async delete(id: string): Promise<AgeGroup> {
    return this.prisma.ageGroup.delete({
      where: { id },
    }) as unknown as AgeGroup;
  }
}
