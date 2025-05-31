import { Module } from '@nestjs/common';
import { CourseProgressController } from './api/course-progress.controller';
import { CourseProgressService } from './service/course-progress.service';
import { EnrollmentModule } from '../enrollment/enrollment.module';
import { SubmissionModule } from '../submission/submission.module';
import { CourseProgressRepository } from './repository/course-progress.repository';

@Module({
  imports: [EnrollmentModule, SubmissionModule],
  controllers: [CourseProgressController],
  providers: [CourseProgressService,CourseProgressRepository],
  exports: [CourseProgressService,CourseProgressRepository]

})
export class CourseProgressModule {}
