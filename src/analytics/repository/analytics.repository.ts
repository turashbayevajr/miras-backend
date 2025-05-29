import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Plan } from '@prisma/client';

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPlanStats(plan: Plan, from?: Date, to?: Date) {
    const users = await this.prisma.user.findMany({
      where: {
        plan,
        createdAt: {
          ...(from && { gte: from }),
          ...(to && { lte: to }),
        },
      },
      select: { id: true },
    });

    const userIds = users.map((u) => u.id);

    const courses = await this.prisma.course.count({
      where: {
        creator: { plan },
        createdAt: {
          ...(from && { gte: from }),
          ...(to && { lte: to }),
        },
      },
    });

    const lessons = await this.prisma.lesson.count({
      where: {
        course: {
          creator: { plan },
        },
        createdAt: {
          ...(from && { gte: from }),
          ...(to && { lte: to }),
        },
      },
    });

    const submissions = await this.prisma.submission.count({
      where: {
        userId: { in: userIds },
        submittedAt: {
          ...(from && { gte: from }),
          ...(to && { lte: to }),
        },
      },
    });

    return {
      users: userIds.length,
      courses,
      lessons,
      submissions,
    };
  }

  async getTopCoursesByEnrollment(from?: Date, to?: Date) {
    return await this.prisma.course.findMany({
      where: {
        enrollments: {
          some: {
            enrolledAt: {
              ...(from && { gte: from }),
              ...(to && { lte: to }),
            },
          },
        },
      },
      orderBy: {
        enrollments: {
          _count: 'desc',
        },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        _count: { select: { enrollments: true } },
      },
    });
  }

  async getTopCoursesBySubmissions(from?: Date, to?: Date) {
    const courses = await this.prisma.course.findMany({
      include: {
        lessons: {
          include: {
            homework: {
              include: {
                submissions: {
                  where: {
                    submittedAt: {
                      ...(from && { gte: from }),
                      ...(to && { lte: to }),
                    },
                  },
                  select: { id: true },
                },
              },
            },
            test: {
              include: {
                submissions: {
                  where: {
                    submittedAt: {
                      ...(from && { gte: from }),
                      ...(to && { lte: to }),
                    },
                  },
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    return courses
      .map((course) => {
        const total = course.lessons.reduce((sum, lesson) => {
          const hw = lesson.homework?.submissions?.length ?? 0;
          const test = lesson.test?.submissions?.length ?? 0;
          return sum + hw + test;
        }, 0);

        return {
          id: course.id,
          title: course.title,
          submissions: total,
        };
      })
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 5);
  }

  async getOverallStats(from?: Date, to?: Date) {
    const [totalUsers, totalCourses, totalLessons, totalSubmissions] =
      await Promise.all([
        this.prisma.user.count({
          where: {
            createdAt: {
              ...(from && { gte: from }),
              ...(to && { lte: to }),
            },
          },
        }),
        this.prisma.course.count({
          where: {
            createdAt: {
              ...(from && { gte: from }),
              ...(to && { lte: to }),
            },
          },
        }),
        this.prisma.lesson.count({
          where: {
            createdAt: {
              ...(from && { gte: from }),
              ...(to && { lte: to }),
            },
          },
        }),
        this.prisma.submission.count({
          where: {
            submittedAt: {
              ...(from && { gte: from }),
              ...(to && { lte: to }),
            },
          },
        }),
      ]);

    return {
      totalUsers,
      totalCourses,
      totalLessons,
      totalSubmissions,
    };
  }
}
