import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TestRepository } from '../repository/test.repository';
import { CreateTestDto } from '../api/dtos/create-test.dto';
import { UpdateTestDto } from '../api/dtos/update-test.dto';
import { Test } from '../repository/test.model';
import messages from '../../configs/messages';

@Injectable()
export class TestService {
  private readonly logger = new Logger(TestService.name);
  private readonly entityName = 'Test';

  constructor(private readonly repo: TestRepository) {}

  async createTest(dto: CreateTestDto): Promise<Test> {
    try {
      const existing = await this.repo.findByLessonId(dto.lessonId);
      if (existing)
        throw new InternalServerErrorException(
          messages.ALREADY_EXIST('Test for this lesson'),
        );
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

  async getAllTests(): Promise<Test[]> {
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

  async getTestById(id: string): Promise<Test> {
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

  async updateTest(id: string, dto: UpdateTestDto): Promise<Test> {
    try {
      await this.getTestById(id);
      return await this.repo.update(id, dto);
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

  async deleteTest(id: string): Promise<Test> {
    try {
      await this.getTestById(id);
      return await this.repo.delete(id);
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
