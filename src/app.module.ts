import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { LessonModule } from './lesson/lesson.module';
import { HomeworkModule } from './homework/homework.module';
import { TestModule } from './test/test.module';
import { SubmissionModule } from './submission/submission.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PrismaModule, CourseModule, AdminModule, EnrollmentModule, LessonModule, HomeworkModule, TestModule, SubmissionModule, AnalyticsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
