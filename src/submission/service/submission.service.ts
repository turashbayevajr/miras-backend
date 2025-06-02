import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SubmissionRepository } from '../repository/submission.repository';
import { CreateSubmissionDto } from '../api/dtos/create-submission.dto';
import { UpdateSubmissionDto } from '../api/dtos/update-submission.dto';
import { Submission } from '../repository/submission.model';
import messages from '../../configs/messages';
import { LessonService } from '../../lesson/service/lesson.service';
import { TestService } from '../../test/service/test.service';

@Injectable()
export class SubmissionService {
  private readonly logger = new Logger(SubmissionService.name);
  private readonly entityName = 'Submission';

  constructor(
    private readonly repo: SubmissionRepository,
    private readonly lessonService: LessonService,
    private readonly testService: TestService,
  ) {}

  async createSubmission(dto: CreateSubmissionDto): Promise<Submission> {
    try {
      let score_test: number | undefined = undefined;
      let score_homework: number | undefined = undefined;
      let passed = false;

      // 1. Оценка за тест
      if (dto.testId) {
        const test = await this.testService.getTestById(dto.testId);
        if (!test) {
          throw new NotFoundException(`Test not found with id: ${dto.testId}`);
        }
        if (!test.questions || test.questions.length === 0) {
          throw new BadRequestException('У теста нет вопросов для оценки.');
        }

        const total = test.questions.length;
        let correct = 0;

        test.questions.forEach((q) => {
          const correctIds = q.variants
            .filter((v) => v.isCorrect)
            .map((v) => v.id);
          const selected = dto.testAnswers?.[q.id] || [];

          const isCorrect =
            correctIds.length === selected.length &&
            correctIds.every((id) => selected.includes(id));

          if (isCorrect) correct++;
        });

        score_test = Number(((correct / total) * 100).toFixed(2));
      } else {
        // если теста нет — считаем как 100
        score_test = 100;
      }

      // 2. Оценка за ДЗ
      if (!dto.testId && dto.content) {
        // если нет теста, но есть ДЗ → auto full score
        score_homework = 100;
      } else if (dto.homeworkId && !dto.content) {
        // если есть ДЗ, но пустой content — ноль
        score_homework = 0;
      }

      // 3. Финальный score
      const parts = [score_test, score_homework].filter(
        (s) => s !== undefined,
      ) as number[];

      const score =
        parts.length > 0
          ? Number((parts.reduce((a, b) => a + b, 0) / parts.length).toFixed(2))
          : 0;

      passed = score >= 50;

      const saved = await this.repo.create({
        ...dto,
        score_test,
        score_homework,
        score,
        passed,
      });

      return saved;
    } catch (error) {
      this.logger.error(
        messages.DATABASE_CREATE_ERROR(this.entityName),
        error.stack,
      );
      throw new InternalServerErrorException(
        messages.DATABASE_CREATE_ERROR(this.entityName),
      );
    }
  }

  async getAllSubmissions(filters: {
    userId?: string;
    lessonId?: string;
    courseId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Submission[]> {
    try {
      // await this.recalculateAllSubmissions();
      return this.repo.findAll(filters);
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
  async recalculateAllSubmissions(): Promise<number> {
    try {
      const submissions = await this.repo.findAllForRecalculation();
      let updatedCount = 0;

      for (const submission of submissions) {
        let { test, homework, testAnswers, content } = submission;
        let score_test: number | undefined = undefined;
        let score_homework: number | undefined = undefined;

        if (test?.questions?.length && testAnswers) {
          let correct = 0;
          const total = test.questions.length;

          for (const q of test.questions) {
            const correctIds = q.variants
              .filter((v) => v.isCorrect)
              .map((v) => v.id);
            const selected = testAnswers[q.id] || [];

            const isCorrect =
              correctIds.length === selected.length &&
              correctIds.every((id) => selected.includes(id));

            if (isCorrect) correct++;
          }

          score_test = Number(((correct / total) * 100).toFixed(2));
        } else if (test) {
          score_test = 0;
        } else {
          score_test = 100;
        }

        if (homework && content) {
          score_homework = 100;
        } else if (homework) {
          score_homework = 0;
        }
        const parts = [score_test, score_homework].filter(
          (s) => s !== undefined,
        ) as number[];
        const score =
          parts.length > 0
            ? Number(
                (parts.reduce((a, b) => a + b, 0) / parts.length).toFixed(2),
              )
            : 0;

        const passed = score >= 50;

        const isDifferent =
          submission.score !== score ||
          submission.score_test !== score_test ||
          submission.score_homework !== score_homework ||
          submission.passed !== passed;

        if (isDifferent) {
          await this.repo.update(submission.id, {
            score,
            score_test,
            score_homework,
            passed,
          });
          updatedCount++;
        }
      }

      return updatedCount;
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

  async getPassedByUser(userId: string) {
    try {
      return await this.repo.findPassedByUser(userId);
    } catch (error) {
      throw new InternalServerErrorException(
        messages.DATABASE_FETCH_ERROR(this.entityName),
      );
    }
  }
  async getSubmissionById(id: string): Promise<Submission> {
    try {
      const item = await this.repo.findById(id);
      if (!item)
        throw new NotFoundException(
          messages.NOT_FOUND_BY_ID(this.entityName, id),
        );
      return item;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id),
        error.stack,
      );
      throw new InternalServerErrorException(
        messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id),
      );
    }
  }
  async checkUserSubmission(lessonId: string, userId: string) {
    const lesson = await this.lessonService.getLessonById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');

    const testId = lesson.test?.id;
    const homeworkId = lesson.homework?.id;

    return this.repo.findByUserAndLessonLinks(userId, testId, homeworkId);
  }

  async updateSubmission(
    id: string,
    dto: UpdateSubmissionDto,
  ): Promise<Submission> {
    try {
      const submission = await this.getSubmissionById(id);

      let score_test = submission.score_test ?? 0;
      let score_homework = submission.score_homework ?? 0;

      if (dto.testAnswers) {
        const test = await this.testService.getTestById(submission.testId!);
        if (!test || !test.questions || test.questions.length === 0) {
          throw new BadRequestException('У теста нет вопросов для оценки.');
        }

        let correct = 0;
        const total = test.questions.length;

        for (const question of test.questions) {
          const correctIds = question.variants
            .filter((v) => v.isCorrect)
            .map((v) => v.id);
          const selected = dto.testAnswers?.[question.id] || [];

          const isCorrect =
            correctIds.length === selected.length &&
            correctIds.every((id) => selected.includes(id));

          if (isCorrect) correct++;
        }

        score_test = Number(((correct / total) * 100).toFixed(2));
      }

      // 2. Reset homework score if content updated
      if (dto.content !== undefined) {
        score_homework = 0;
      }

      // 3. Recalculate total score
      const score = Number(((score_test + score_homework) / 2).toFixed(2));
      const passed = score >= 50;

      // 4. Now build final data object with all values
      const updatedData: UpdateSubmissionDto = {
        ...dto,
        score_test,
        score_homework,
        score,
        passed,
      };

      const upd_submission = await this.repo.update(id, updatedData);
      await this.recalculateAllSubmissions();
      return upd_submission;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        messages.DATABASE_UPDATE_ERROR(this.entityName, id),
        error.stack,
      );
      throw new InternalServerErrorException(
        messages.DATABASE_UPDATE_ERROR(this.entityName, id),
      );
    }
  }

  async deleteSubmission(id: string): Promise<Submission> {
    try {
      await this.getSubmissionById(id);
      return this.repo.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        messages.DATABASE_DELETE_ERROR(this.entityName, id),
        error.stack,
      );
      throw new InternalServerErrorException(
        messages.DATABASE_DELETE_ERROR(this.entityName, id),
      );
    }
  }

  async deleteMany(ids: string[]): Promise<number> {
    try {
      return await this.repo.deleteMany(ids);
    } catch (error) {
      this.logger.error(
        messages.DATABASE_DELETE_ERROR_ARRAY(this.entityName, ids),
        error.stack,
      );
      throw new InternalServerErrorException(
        messages.DATABASE_DELETE_ERROR_ARRAY(this.entityName, ids),
      );
    }
  }
async updateHomeworkScore(id: string, score_homework: number) {
  try {
    const existing = await this.getSubmissionById(id);

const hasTestScore = existing.score_test !== null && existing.score_test !== undefined;

const score = hasTestScore
  ? Math.round(((existing.score_test as number) + score_homework) / 2)
  : score_homework;

    return await this.repo.updateHomeworkScore(id, score_homework, score);
  } catch (error) {
    if (error instanceof NotFoundException) throw error;

    this.logger.error(
      messages.DATABASE_UPDATE_ERROR(this.entityName, id),
      error.stack,
    );
    throw new InternalServerErrorException(
      messages.DATABASE_UPDATE_ERROR(this.entityName, id),
    );
  }
}


}
