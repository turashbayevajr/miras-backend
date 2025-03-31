import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateHomeworkDto } from "../api/dtos/create-homework.dto";
import { UpdateHomeworkDto } from "../api/dtos/update-homework.dto";
import { Homework } from "./homework.model";

@Injectable()
export class HomeworkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateHomeworkDto): Promise<Homework> {
    return this.prisma.homework.create({ data }) as unknown as Homework;
  }

  async findAll(): Promise<Homework[]> {
    return this.prisma.homework.findMany() as unknown as Homework[];
  }

  async findById(id: string): Promise<Homework | null> {
    return this.prisma.homework.findUnique({ where: { id } }) as unknown as Homework;
  }

  async update(id: string, data: UpdateHomeworkDto): Promise<Homework> {
    return this.prisma.homework.update({ where: { id }, data }) as unknown as Homework;
  }

 async delete(id: string): Promise<Homework> {
     return this.prisma.homework.update({
       where: { id },
       data: { deletedAt: new Date() },
     }) as unknown as Homework;
   }  
 
   async deleteMany(ids: string[]): Promise<number> {
     const res = await this.prisma.homework.updateMany({
       where: { id: { in: ids } },
       data: { deletedAt: new Date() },
     });
     return res.count;
   }
  async findByLessonId(lessonId: string): Promise<Homework | null> {
    return this.prisma.homework.findUnique({ where: { lessonId } }) as unknown as Homework;
  }
}
