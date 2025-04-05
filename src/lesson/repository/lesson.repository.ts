import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateLessonDto } from "../api/dtos/create-lesson.dto";
import { UpdateLessonDto } from "../api/dtos/update-lesson.dto";
import { Lesson } from "./lesson.model";

@Injectable()
export class LessonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLessonDto): Promise<Lesson> {
    return this.prisma.lesson.create({ data }) as unknown as Lesson;
  }

  async findAll(): Promise<Lesson[]> {
    return this.prisma.lesson.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    }) as unknown as Lesson[];
  }

  async findById(id: string): Promise<Lesson | null> {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: {
        homework: {
          include: {
            submissions: {
              include: {
                user: true,
              },
            },
          },
        },
        test: {
          include: {
            submissions: {
              include: {
                user: true,
              },
            },
            questions: {
              include: {
                variants: true,
              },
            },
          },
        },
      },
    }) as unknown as Lesson;
  }  
  async update(id: string, data: UpdateLessonDto): Promise<Lesson> {
    return this.prisma.lesson.update({ where: { id }, data }) as unknown as Lesson;
  }

  async delete(id: string): Promise<Lesson> {
    return this.prisma.lesson.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as unknown as Lesson;
  }  

  async deleteMany(ids: string[]): Promise<number> {
    const res = await this.prisma.lesson.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
    return res.count;
  }
}
