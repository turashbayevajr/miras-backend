import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enrollStudent(userId: string, courseId: string) {
    // Проверяем, существует ли курс
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    console.log("userId в сервисе:", userId);
    if (!course) throw new NotFoundException('Курс не найден');

    // Проверяем, записан ли студент уже на этот курс
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (existingEnrollment) throw new ConflictException('Вы уже записаны на этот курс');

    // Записываем студента
    return this.prisma.enrollment.create({
      data: { userId, courseId },
    });
  }
}
