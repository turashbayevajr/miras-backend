import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateSubmissionDto } from "../api/dtos/create-submission.dto";
import { UpdateSubmissionDto } from "../api/dtos/update-submission.dto";
import { Submission } from "./submission.model";
import { Prisma } from "@prisma/client";

@Injectable()
export class SubmissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSubmissionDto): Promise<Submission> {
    return this.prisma.submission.create({ data }) as unknown as Submission;
  }

  async findAll(): Promise<Submission[]> {
    return this.prisma.submission.findMany() as unknown as Submission[];
  }

  async findById(id: string): Promise<Submission | null> {
    return this.prisma.submission.findUnique({ where: { id } }) as unknown as Submission;
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
        score: true,
        score_test: true,
        score_homework: true,
        submittedAt: true,
      },
    });
  }
  
  
  async update(id: string, data: UpdateSubmissionDto): Promise<Submission> {
    return this.prisma.submission.update({ where: { id }, data }) as unknown as Submission;
  }

  async delete(id: string): Promise<Submission> {
    return this.prisma.submission.update({
      where: { id },
      data: { deletedAt: new Date() },
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
