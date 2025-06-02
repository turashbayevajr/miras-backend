import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubmissionDto } from '../api/dtos/create-submission.dto';
import { UpdateSubmissionDto } from '../api/dtos/update-submission.dto';
import { Submission } from './submission.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSubmissionDto): Promise<Submission> {
    return this.prisma.submission.create({ data }) as unknown as Submission;
  }

  async findAll(filters: {
    userId?: string;
    lessonId?: string;
    courseId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const conditions: any[] = [];

    if (filters.userId) {
      conditions.push({ userId: filters.userId });
    }

    if (filters.lessonId) {
      conditions.push({
        OR: [
          { test: { lessonId: filters.lessonId } },
          { homework: { lessonId: filters.lessonId } },
        ],
      });
    }

    if (filters.courseId) {
      conditions.push({
        OR: [
          { test: { lesson: { courseId: filters.courseId } } },
          { homework: { lesson: { courseId: filters.courseId } } },
        ],
      });
    }

    if (filters.startDate || filters.endDate) {
      const submittedAt: any = {};
      if (filters.startDate) submittedAt.gte = new Date(filters.startDate);
      if (filters.endDate) submittedAt.lte = new Date(filters.endDate);
      conditions.push({ submittedAt });
    }

    const where = conditions.length > 0 ? { AND: conditions } : {};

    const submissions = await this.prisma.submission.findMany({
      where,
      include: {
        user: { select: { id: true, fullName: true } },
        test: {
          select: {
            title: true,
            lessonId: true,
            lesson: {
              select: {
                id: true,
                title: true,
                courseId: true,
                course: { select: { title: true } },
              },
            },
          },
        },
        homework: {
          select: {
            title: true,
            lessonId: true,
            lesson: {
              select: {
                id: true,
                title: true,
                courseId: true,
                course: { select: { title: true } },
              },
            },
          },
        },
      },
    });

    return submissions.map((s) => {
      const testLesson = s.test?.lesson;
      const homeworkLesson = s.homework?.lesson;
      const lesson = testLesson || homeworkLesson;

      return {
        id: s.id,
        user: s.user.fullName,
        userId: s.user.id,
        content: s.content ?? '',
        submittedAt: s.submittedAt,
        score_homework: s.score_homework,
        score_test: s.score_test,
        score: s.score,
        testTitle: s.test?.title,
        homeworkTitle: s.homework?.title,
        lessonTitle: lesson?.title ?? null,
        lessonId: lesson?.id ?? null,
        courseTitle: lesson?.course?.title ?? null,
        courseId: lesson?.courseId ?? null,
      };
    });
  }

  async findAllForRecalculation(): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: { deletedAt: null },
      include: {
        test: {
          include: {
            questions: {
              include: {
                variants: true,
              },
            },
          },
        },
        homework: true,
      },
    }) as unknown as Submission[];
  }
  async findPassedByUser(userId: string) {
    return this.prisma.submission.findMany({
      where: {
        userId,
        passed: true,
        deletedAt: null,
      },
    });
  }

  async findById(id: string): Promise<Submission | null> {
    return this.prisma.submission.findUnique({
      where: { id },
    }) as unknown as Submission;
  }
  async findByUserAndLessonLinks(
    userId: string,
    testId?: string,
    homeworkId?: string,
  ) {
    const orConditions: Prisma.SubmissionWhereInput[] = [];

    if (testId) {
      orConditions.push({ testId });
    }

    if (homeworkId) {
      orConditions.push({ homeworkId });
    }

    return this.prisma.submission.findFirst({
      where: {
        userId,
        OR: orConditions.length > 0 ? orConditions : undefined,
      },
      select: {
        id: true,
        content: true,
        testAnswers: true,
        score: true,
        score_test: true,
        score_homework: true,
        submittedAt: true,
      },
    });
  }

  async update(id: string, data: UpdateSubmissionDto): Promise<Submission> {
    return this.prisma.submission.update({
      where: { id },
      data,
    }) as unknown as Submission;
  }
async updateHomeworkScore(
  id: string,
  score_homework: number,
  score: number,
) {
  return this.prisma.submission.update({
    where: { id },
    data: {
      score_homework,
      score,
    },
  });
}


  async delete(id: string): Promise<Submission> {
    return this.prisma.submission.delete({
      where: { id },
    }) as unknown as Submission;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const res = await this.prisma.submission.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
    return res.count;
  }
}
