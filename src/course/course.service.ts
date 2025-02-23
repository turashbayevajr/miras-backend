import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async createCourse(title: string, description: string, imageUrl: string, teacherId?: string) {
    console.log("Сохраняем imageUrl:", imageUrl);
    return this.prisma.course.create({
      data: { title, description, imageUrl, teacherId },
    });
  }

  async getAllCourses() {
    return this.prisma.course.findMany({
      include: { teacher: true, enrollments: true },
    });
  }

  async getCourseById(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: { teacher: true, enrollments: true },
    });
  }

  async getCoursesByTeacher(teacherId: string) {
    const courses = await this.prisma.course.findMany({
      where: { teacherId },
      include: {
        enrollments: {
          include: {
            user: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
    });
  
    console.log("Курсы с записанными студентами:", courses);
    return courses;
  }
    


  async updateCourse(id: string, title: string, description: string, imageUrl: string, teacherId?: string) {
    return this.prisma.course.update({
      where: { id },
      data: { title, description, imageUrl, teacherId },
    });
  }

  async deleteCourse(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }
}
