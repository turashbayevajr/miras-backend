import { Module } from '@nestjs/common';
import { EnrollmentController } from './api/enrollment.controller';
import { EnrollmentService } from './service/enrollment.service';
import { EnrollmentRepository } from './repository/enrollment.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentRepository, PrismaService],
  exports: [EnrollmentService, EnrollmentRepository],
})
export class EnrollmentModule {}
