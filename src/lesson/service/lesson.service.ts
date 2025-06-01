import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { LessonRepository } from '../repository/lesson.repository';
import { CreateLessonDto } from '../api/dtos/create-lesson.dto';
import { UpdateLessonDto } from '../api/dtos/update-lesson.dto';
import { Lesson } from '../repository/lesson.model';
import messages from '../../configs/messages';
import { CourseService } from '../../course/service/course.service';

@Injectable()
export class LessonService {
  private readonly logger = new Logger(LessonService.name);
  private readonly entityName = 'Lesson';

  constructor(
    private readonly repo: LessonRepository,
    private readonly courseService: CourseService,
  ) {}

  async createLesson(dto: CreateLessonDto): Promise<Lesson> {
    try {
      return await this.repo.create(dto);
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

  async getAllLessons(): Promise<Lesson[]> {
    try {
      return this.repo.findAll();
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
  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    try {
      const course = await this.courseService.getCourseById(courseId);
      if (!course)
        throw new NotFoundException(
          messages.NOT_FOUND_BY_ID(this.entityName, courseId),
        );
      return this.repo.findByCourseId(courseId);
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

  async getLessonById(id: string): Promise<Lesson> {
    try {
      const lesson = await this.repo.findById(id);
      if (!lesson)
        throw new NotFoundException(
          messages.NOT_FOUND_BY_ID(this.entityName, id),
        );
      return lesson;
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

  async updateLesson(id: string, dto: UpdateLessonDto): Promise<Lesson> {
    try {
      await this.getLessonById(id);
      return this.repo.update(id, dto);
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

  async deleteLesson(id: string): Promise<Lesson> {
    try {
      await this.getLessonById(id);
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
}
