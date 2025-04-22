import { Module } from "@nestjs/common";
import { CourseController } from "./api/course.controller";
import { CourseService } from "./service/course.service";
import { CourseRepository } from "./repository/course.repository";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseRepository, PrismaService,JwtService],
  exports: [CourseService, CourseRepository],
})
export class CourseModule {}
