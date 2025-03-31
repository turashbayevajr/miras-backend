import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCourseDto } from "../api/dtos/create-course.dto";
import { UpdateCourseDto } from "../api/dtos/update-course.dto";
import { Course } from "./course.model";

@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseDto): Promise<Course> {
    return this.prisma.course.create({ data }) as unknown as Course;
  }

  async findAll(): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { deletedAt:null },
    }) as unknown as Course[];
  }

  async findById(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({ where: { id,  deletedAt:null } }) as unknown as Course;
  }

  async update(id: string, data: UpdateCourseDto): Promise<Course> {
    return this.prisma.course.update({ where: { id }, data }) as unknown as Course;
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
