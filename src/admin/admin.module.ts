import { Module } from '@nestjs/common';
import { AdminController, AdminCoursesController, AdminOrdersController } from './admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AdminController, AdminCoursesController, AdminOrdersController],
  providers: [PrismaService]
})
export class AdminModule {}
