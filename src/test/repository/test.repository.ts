import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestDto } from '../api/dtos/create-test.dto';
import { UpdateTestDto } from '../api/dtos/update-test.dto';
import { Test } from './test.model';

@Injectable()
export class TestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTestDto): Promise<Test> {
    const { questions = [], ...testData } = data;

    if (questions.length === 0) {
      throw new Error('At least one question is required to create a test.');
    }

    return await this.prisma.test.create({
      data: {
        ...testData,
        questions: {
          create: questions.map((question) => ({
            text: question.text,
            variants: {
              create: question.variants.map((variant) => ({
                text: variant.text,
                isCorrect: variant.isCorrect,
              })),
            },
          })),
        },
      },
    });
  }

  async update(id: string, data: UpdateTestDto): Promise<Test> {
    const { questions = [], title } = data;

    if (questions.length === 0) {
      throw new Error('At least one question is required to update a test.');
    }
    await this.prisma.variant.deleteMany({
      where: {
        question: {
          testId: id,
        },
      },
    });
    await this.prisma.question.deleteMany({
      where: { testId: id },
    });

    await this.prisma.test.update({
      where: { id },
      data: { title },
    });

    for (const q of questions) {
      const createdQuestion = await this.prisma.question.create({
        data: {
          text: q.text ?? '',
          testId: id,
        },
      });

      await this.prisma.variant.createMany({
        data: (q.variants ?? []).map((v) => ({
          text: v.text ?? '',
          isCorrect: v.isCorrect ?? false,
          questionId: createdQuestion.id,
        })),
      });
    }
    return this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            variants: true,
          },
        },
      },
    }) as unknown as Test;
  }

  async findAll(): Promise<Test[]> {
    return this.prisma.test.findMany({
      include: {
        questions: {
          include: {
            variants: true,
          },
        },
      },
    }) as unknown as Test[];
  }

  async findById(id: string): Promise<Test | null> {
    return this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            variants: true,
          },
        },
      },
    }) as unknown as Test;
  }

  async delete(id: string): Promise<Test> {
    return this.prisma.test.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as unknown as Test;
  }

  async deleteMany(ids: string[]): Promise<number> {
    const res = await this.prisma.test.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
    return res.count;
  }

  async findByLessonId(lessonId: string): Promise<Test | null> {
    return this.prisma.test.findUnique({
      where: { lessonId },
      include: {
        questions: {
          include: {
            variants: true,
          },
        },
      },
    }) as unknown as Test;
  }
}
