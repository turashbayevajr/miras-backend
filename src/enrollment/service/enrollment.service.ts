import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EnrollmentRepository } from '../repository/enrollment.repository';
import { CreateEnrollmentDto } from '../api/dtos/create-enrollment.dto';
import { UpdateEnrollmentDto } from '../api/dtos/update-enrollment.dto';
import { Enrollment } from '../repository/enrollment.model';
import messages from '../../configs/messages';

@Injectable()
export class EnrollmentService {
  private readonly logger = new Logger(EnrollmentService.name);
  private readonly entityName = 'Enrollment';

  constructor(private readonly enrollmentRepository: EnrollmentRepository) {}

  async createEnrollment(dto: CreateEnrollmentDto): Promise<Enrollment> {
    try {
      const existing = await this.enrollmentRepository.findByUserAndCourse(
        dto.userId,
        dto.courseId,
      );

      if (existing) {
        if (existing.deletedAt) {
          return await this.enrollmentRepository.restore(existing.id);
        }
        throw new InternalServerErrorException(
          messages.ALREADY_EXIST(this.entityName),
        );
      }

      return await this.enrollmentRepository.create(dto);
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

  async getAllEnrollments(): Promise<Enrollment[]> {
    try {
      return this.enrollmentRepository.findAll();
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
  async getPendingEnrollments() {
    try {
      return this.enrollmentRepository.findAllPending();
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
  async getPendingTeacher(userId: string) {
    try {
      return this.enrollmentRepository.findPendingByTeacher(userId);
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
  async getAllEnrollmentsForTeacher(userId: string) {
    try {
      return this.enrollmentRepository.findAllEnrollmentsByTeacher(userId);
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
  async getEnrollmentById(id: string): Promise<Enrollment> {
    try {
      const item = await this.enrollmentRepository.findById(id);
      if (!item) {
        throw new NotFoundException(
          messages.NOT_FOUND_BY_ID(this.entityName, id),
        );
      }
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
  async findByUser(userId: string): Promise<Enrollment[]> {
    try {
      const items = await this.enrollmentRepository.findByUser(userId);
      if (!items || items.length === 0) {
        throw new NotFoundException(
          messages.NOT_FOUND_BY_FIELD(this.entityName, 'userId', userId),
        );
      }
      return items;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        messages.DATABASE_FETCH_ERROR_BY_FIELD(
          this.entityName,
          'userId',
          userId,
        ),
        error.stack,
      );
      throw new InternalServerErrorException(
        messages.DATABASE_FETCH_ERROR_BY_FIELD(
          this.entityName,
          'userId',
          userId,
        ),
      );
    }
  }
  async updateEnrollment(
    id: string,
    dto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    try {
      await this.getEnrollmentById(id);
      return await this.enrollmentRepository.update(id, dto);
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

  async deleteEnrollment(id: string): Promise<Enrollment> {
    try {
      await this.getEnrollmentById(id);
      return await this.enrollmentRepository.delete(id);
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

  async deleteMultiple(ids: string[]): Promise<number> {
    try {
      return await this.enrollmentRepository.deleteMany(ids);
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
  async getAllEnrollmentsWithCourseAndLessons() {
    try {
      return await this.enrollmentRepository.findAllWithCourseAndLessons();
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
