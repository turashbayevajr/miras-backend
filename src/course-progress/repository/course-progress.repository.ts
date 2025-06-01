import { Injectable } from '@nestjs/common';
import { CourseProgress } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourseProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: {
    userId?: string;
    courseId?: string;
  }): Promise<CourseProgress[]> {
    return this.prisma.courseProgress.findMany({
      where: {
        enrollment: {
          userId: filters?.userId,
          courseId: filters?.courseId,
          deletedAt: null,
        },
      },
      include: {
        enrollment: {
          include: {
            user: true,
            course: true,
          },
        },
      },
    });
  }

  async upsert(data: {
    enrollmentId: string;
    totalLessons: number;
    completedLessons: number;
    progressPercent: number;
    averageScore: number | null;
  }): Promise<CourseProgress> {
    return this.prisma.courseProgress.upsert({
      where: { enrollmentId: data.enrollmentId },
      update: {
        totalLessons: data.totalLessons,
        completedLessons: data.completedLessons,
        progressPercent: data.progressPercent,
        averageScore: data.averageScore,
      },
      create: {
        enrollmentId: data.enrollmentId,
        totalLessons: data.totalLessons,
        completedLessons: data.completedLessons,
        progressPercent: data.progressPercent,
        averageScore: data.averageScore,
      },
    });
  }
}
