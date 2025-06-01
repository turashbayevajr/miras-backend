import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CourseProgressRepository } from '../repository/course-progress.repository';
import messages from '../../configs/messages';
import { EnrollmentService } from '../../enrollment/service/enrollment.service';
import { SubmissionService } from '../../submission/service/submission.service';

@Injectable()
export class CourseProgressService {
  private readonly logger = new Logger(CourseProgressService.name);
  private readonly entityName = 'CourseProgress';

  constructor(
    private readonly repo: CourseProgressRepository,
    private readonly enrollmentService: EnrollmentService,
    private readonly submissionService: SubmissionService,
  ) {}

  async updateOrGenerate(): Promise<void> {
    try {
      const enrollments =
        await this.enrollmentService.getAllEnrollmentsWithCourseAndLessons();

      for (const enrollment of enrollments) {
        const lessons = enrollment.course.lessons.filter((l) => !l.deletedAt);
        const totalLessons = lessons.length;

        if (totalLessons === 0) {
          await this.repo.upsert({
            enrollmentId: enrollment.id,
            totalLessons: 0,
            completedLessons: 0,
            progressPercent: 0,
            averageScore: null,
          });
          continue;
        }

        const submissions = await this.submissionService.getPassedByUser(
          enrollment.userId,
        );

        let completedLessons = 0;
        const usedScores: number[] = [];

        for (const lesson of lessons) {
          const testSubmission = lesson.test
            ? submissions.find((s) => s.testId === lesson.test?.id && s.passed)
            : null;

          const homeworkSubmission = lesson.homework
            ? submissions.find(
                (s) => s.homeworkId === lesson.homework?.id && s.passed,
              )
            : null;

          const testOk = !lesson.test || !!testSubmission;
          const homeworkOk = !lesson.homework || !!homeworkSubmission;

          if (testOk && homeworkOk) {
            completedLessons++;

            if (testSubmission?.score_test) {
              usedScores.push(testSubmission.score_test);
            }
            if (homeworkSubmission?.score_homework) {
              usedScores.push(homeworkSubmission.score_homework);
            }
          }
        }

        const progressPercent = Number(
          ((completedLessons / totalLessons) * 100).toFixed(2),
        );
        const averageScore = usedScores.length
          ? Number(
              (
                usedScores.reduce((a, b) => a + b, 0) / usedScores.length
              ).toFixed(2),
            )
          : null;

        await this.repo.upsert({
          enrollmentId: enrollment.id,
          totalLessons,
          completedLessons,
          progressPercent,
          averageScore,
        });

        await this.enrollmentService.updateEnrollment(enrollment.id, {
          overallProgress: progressPercent,
        });
      }
    } catch (error) {
      this.logger.error(
        messages.DATABASE_UPDATE_ERROR(this.entityName, 'bulk'),
        error.stack,
      );
      throw new InternalServerErrorException(
        messages.DATABASE_UPDATE_ERROR(this.entityName, 'bulk'),
      );
    }
  }

  async findAll(filters?: { userId?: string; courseId?: string }) {
    try {
      return await this.repo.findAll(filters);
    } catch (error) {
      this.logger.error(
        messages.DATABASE_FETCH_ERROR(this.entityName),
        error.stack,
      );
      throw new InternalServerErrorException(
        messages.DATABASE_FETCH_ERROR(this.entityName),
      );
    }
  }
}
