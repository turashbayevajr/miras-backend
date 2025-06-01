import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from '../api/dtos/create-course.dto';
import { UpdateCourseDto } from '../api/dtos/update-course.dto';
import { Course } from './course.model';
import { Plan } from '@prisma/client';
import { CourseDto } from '../api/dtos/course.dto';

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CourseDto): Promise<Course> {
    return this.prisma.course.create({ data }) as unknown as Course;
  }

  async findAll(): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { deletedAt: null },
      orderBy: {
        createdAt: 'asc',
      },
    }) as unknown as Course[];
  }
  async findByPlan(plan?: Plan): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: {
        deletedAt: null,
        ...(plan ? { plan } : {}),
      },
      orderBy: {
        createdAt: 'asc',
      },
    }) as unknown as Course[];
  }
  async findCoursesByUserEnrollment(userId: string): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: {
        deletedAt: null,
        enrollments: {
          some: {
            userId,
            is_approved: true,
            deletedAt: null,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    }) as unknown as Course[];
  }
  async findPendingByUserEnrollment(userId: string): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: {
        deletedAt: null,
        enrollments: {
          some: {
            userId,
            is_approved: false,
            deletedAt: null,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    }) as unknown as Course[];
  }
  async findByCreatorOrEnrolled(userId: string): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: {
        deletedAt: null,
        OR: [
          { creatorId: userId },
          {
            enrollments: {
              some: {
                userId,
                deletedAt: null,
              },
            },
          },
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        enrollments: {
          // include all enrollments (not filtered by user)
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id: string, userId?: string): Promise<Course | null> {
    const includeLessons: any = {
      where: { deletedAt: null },
      include: {},
    };

    if (userId) {
      includeLessons.include = {
        homework: {
          select: {
            id: true,
            submissions: {
              where: { userId },
              select: {
                id: true,
                score_homework: true,
                passed: true,
                score: true,
                submittedAt: true,
              },
            },
          },
        },
        test: {
          select: {
            id: true,
            submissions: {
              where: { userId },
              select: {
                id: true,
                score_test: true,
                score: true,
                passed: true,
                submittedAt: true,
              },
            },
          },
        },
      };
    }

    return this.prisma.course.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        lessons: includeLessons,
      },
    }) as unknown as Course;
  }

  async update(id: string, data: UpdateCourseDto): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data,
    }) as unknown as Course;
  }

  async delete(id: string): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as unknown as Course;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const res = await this.prisma.course.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
    return res.count;
  }
}
