import { Module } from '@nestjs/common';
import { LessonController } from './api/lesson.controller';
import { LessonService } from './service/lesson.service';
import { LessonRepository } from './repository/lesson.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [CourseModule],
  controllers: [LessonController],
  providers: [LessonService, LessonRepository, PrismaService],
  exports: [LessonService, LessonRepository],
})
export class LessonModule {}
