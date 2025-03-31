import { Module } from "@nestjs/common";
import { HomeworkController } from "./api/homework.controller";
import { HomeworkService } from "./service/homework.service";
import { HomeworkRepository } from "./repository/homework.repository";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [HomeworkController],
  providers: [HomeworkService, HomeworkRepository, PrismaService],
  exports: [HomeworkService, HomeworkRepository],
})
export class HomeworkModule {}
