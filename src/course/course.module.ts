import { Module } from "@nestjs/common";
import { CourseController } from "./api/course.controller";
import { CourseService } from "./service/course.service";
import { CourseRepository } from "./repository/course.repository";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseRepository, PrismaService,],
  exports: [CourseService, CourseRepository],
})
export class CourseModule {}
