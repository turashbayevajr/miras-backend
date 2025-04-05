import { Module } from "@nestjs/common";
import { SubmissionController } from "./api/submission.controller";
import { SubmissionService } from "./service/submission.service";
import { SubmissionRepository } from "./repository/submission.repository";
import { PrismaService } from "../prisma/prisma.service";
import { LessonModule } from "../lesson/lesson.module";
import { TestModule } from "../test/test.module";

@Module({
  imports: [LessonModule, TestModule],
  controllers: [SubmissionController],
  providers: [SubmissionService, SubmissionRepository, PrismaService],
  exports: [SubmissionService, SubmissionRepository],
})
export class SubmissionModule {}
