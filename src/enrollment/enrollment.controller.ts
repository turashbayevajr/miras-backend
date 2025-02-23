import { Controller, Post, Body } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}

  @Post()
  async enroll(@Body() { userId, courseId }: { userId: string; courseId: string }) {
    return this.enrollmentService.enrollStudent(userId, courseId);
  }
}
