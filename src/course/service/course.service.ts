import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CourseRepository } from '../repository/course.repository';
import { CreateCourseDto } from '../api/dtos/create-course.dto';
import { UpdateCourseDto } from '../api/dtos/update-course.dto';
import { Course } from '../repository/course.model';
import messages from '../../configs/messages';
import { Plan } from '@prisma/client';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);
  private readonly entityName = 'Course';

  constructor(private readonly courseRepository: CourseRepository) {}

  async createCourse(dto: CreateCourseDto): Promise<Course> {
    try {
      return await this.courseRepository.create(dto);
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

  async getAllCourses(): Promise<Course[]> {
    try {
      return this.courseRepository.findAll();
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
    async getTeacherCourses(userId: string): Promise<Course[]> {
    try {
      return this.courseRepository.findByCreatorOrEnrolled(userId);
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
  async getCoursesByPlan(plan: Plan): Promise<Course[]> {
    try {
      return this.courseRepository.findByPlan(plan);
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
  async getMyCourses(userId: string): Promise<Course[]> {
    try {
      return await this.courseRepository.findCoursesByUserEnrollment(userId);
    } catch (error) {
      this.logger.error(
        `Failed to fetch enrolled courses for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch enrolled courses',
      );
    }
  }
  async getMyPendingCourses(userId: string): Promise<Course[]> {
    try {
      return await this.courseRepository.findPendingByUserEnrollment(userId);
    } catch (error) {
      this.logger.error(
        `Failed to fetch enrolled courses for user ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to fetch enrolled courses',
      );
    }
  }

async getCourseById(id: string, userId?: string): Promise<Course> {
  try {
    const course = await this.courseRepository.findById(id, userId);

    if (!course) {
      throw new NotFoundException(
        messages.NOT_FOUND_BY_ID(this.entityName, id),
      );
    }

    return course;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }

    this.logger.error(
      messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id),
      error.stack,
    );

    throw new InternalServerErrorException(
      messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id),
    );
  }
}


  async updateCourse(id: string, dto: UpdateCourseDto): Promise<Course> {
    try {
      await this.getCourseById(id); // validation
      return await this.courseRepository.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        messages.DATABASE_UPDATE_ERROR(this.entityName, id),
        error.stack,
      );
      throw new InternalServerErrorException(
        messages.DATABASE_UPDATE_ERROR(this.entityName, id),
      );
    }
  }

  async deleteCourse(id: string): Promise<Course> {
    try {
      await this.getCourseById(id);
      return await this.courseRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        messages.DATABASE_DELETE_ERROR(this.entityName, id),
        error.stack,
      );
      throw new InternalServerErrorException(
        messages.DATABASE_DELETE_ERROR(this.entityName, id),
      );
    }
  }

  async deleteMultipleCourses(ids: string[]): Promise<number> {
    try {
      return await this.courseRepository.deleteMany(ids);
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
