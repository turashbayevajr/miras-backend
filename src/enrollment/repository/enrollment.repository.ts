import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEnrollmentDto } from '../api/dtos/create-enrollment.dto';
import { UpdateEnrollmentDto } from '../api/dtos/update-enrollment.dto';
import { Enrollment } from './enrollment.model';

@Injectable()
export class EnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEnrollmentDto): Promise<Enrollment> {
    return this.prisma.enrollment.create({ data }) as unknown as Enrollment;
  }

  async findAll(): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        user: true,
        course: true,
      },
      orderBy: {
        id: 'desc',
      },
    }) as unknown as Enrollment[];
  }

  async findByUser(userId: string) {
    return this.prisma.enrollment.findMany({
      where: {
        userId,
        is_approved: true,
        deletedAt: null,
      },
      select: {
        id: true,
        courseId: true,
        userId: true,
        enrolledAt: true,
      },
    });
  }
  async findAllPending() {
    return this.prisma.enrollment.findMany({
      where: { is_approved: false, deletedAt: null },
      include: {
        user: true,
        course: true,
      },
    });
  }

  async findById(id: string): Promise<Enrollment | null> {
    return this.prisma.enrollment.findUnique({
      where: { id },
    }) as unknown as Enrollment;
  }

  async update(id: string, data: UpdateEnrollmentDto): Promise<Enrollment> {
    return this.prisma.enrollment.update({
      where: { id },
      data,
    }) as unknown as Enrollment;
  }

  async delete(id: string): Promise<Enrollment> {
    return this.prisma.enrollment.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as unknown as Enrollment;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const res = await this.prisma.enrollment.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
    return res.count;
  }

  async findByUserAndCourse(
    userId: string,
    courseId: string,
  ): Promise<Enrollment | null> {
    return this.prisma.enrollment.findFirst({
      where: { userId, courseId },
    }) as unknown as Enrollment;
  }
  async restore(id: string): Promise<Enrollment> {
    return this.prisma.enrollment.update({
      where: { id },
      data: {
        deletedAt: null,
        is_approved: false,
      },
    }) as unknown as Enrollment;
  }
}
