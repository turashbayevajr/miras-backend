import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTestDto } from "../api/dtos/create-test.dto";
import { UpdateTestDto } from "../api/dtos/update-test.dto";
import { Test } from "./test.model";

@Injectable()
export class TestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTestDto): Promise<Test> {
    return this.prisma.test.create({ data }) as unknown as Test;
  }

  async findAll(): Promise<Test[]> {
    return this.prisma.test.findMany() as unknown as Test[];
  }

  async findById(id: string): Promise<Test | null> {
    return this.prisma.test.findUnique({ where: { id } }) as unknown as Test;
  }

  async update(id: string, data: UpdateTestDto): Promise<Test> {
    return this.prisma.test.update({ where: { id }, data }) as unknown as Test;
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
    return this.prisma.test.findUnique({ where: { lessonId } }) as unknown as Test;
  }
}
