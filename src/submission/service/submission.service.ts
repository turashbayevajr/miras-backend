import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    BadRequestException
  } from "@nestjs/common";
  import { SubmissionRepository } from "../repository/submission.repository";
  import { CreateSubmissionDto } from "../api/dtos/create-submission.dto";
  import { UpdateSubmissionDto } from "../api/dtos/update-submission.dto";
  import { Submission } from "../repository/submission.model";
  import messages from "../../configs/messages";
import { LessonService } from "../../lesson/service/lesson.service";
import { TestService } from "../../test/service/test.service";
  
  @Injectable()
  export class SubmissionService {
    private readonly logger = new Logger(SubmissionService.name);
    private readonly entityName = "Submission";
  
    constructor(
      private readonly repo: SubmissionRepository,
      private readonly lessonService: LessonService,
      private readonly testService: TestService

    ) {}
  
    async createSubmission(dto: CreateSubmissionDto): Promise<Submission> {
      try {
        let score_test: number | undefined = undefined;
    
        if (dto.testId && dto.testAnswers) {
        const test = await this.testService.getTestById(dto.testId);    
          if (!test) {
            throw new NotFoundException(`Test not found with id: ${dto.testId}`);
          }
          if (!test?.questions || test.questions.length === 0) {
            throw new BadRequestException('У теста нет вопросов для оценки.');
          }
    
          const total = test.questions.length;
          let correct = 0;
    
          test.questions.forEach((q) => {
            const correctIds = q.variants.filter(v => v.isCorrect).map(v => v.id);
            const selected = dto.testAnswers?.[q.id] || [];
    
            const isCorrect =
              correctIds.length === selected.length &&
              correctIds.every(id => selected.includes(id));
    
            if (isCorrect) correct++;
          });
    
          score_test = Number(((correct / total) * 100).toFixed(2));
        }
    
        const saved = await this.repo.create({
          ...dto,
          score_test,
        });
    
        return saved;
      } catch (error) {
        this.logger.error(messages.DATABASE_CREATE_ERROR(this.entityName), error.stack);
        throw new InternalServerErrorException(messages.DATABASE_CREATE_ERROR(this.entityName));
      }
    }    
  
    async getAllSubmissions(): Promise<Submission[]> {
      try {
        return this.repo.findAll();
      } catch (error) {
        this.logger.error(messages.DATABASE_FETCH_ERROR(this.entityName), error.stack);
        throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR(this.entityName));
      }
    }
  
    async getSubmissionById(id: string): Promise<Submission> {
      try {
        const item = await this.repo.findById(id);
        if (!item) throw new NotFoundException(messages.NOT_FOUND_BY_ID(this.entityName, id));
        return item;
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        this.logger.error(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id), error.stack);
        throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id));
      }
    }
    async checkUserSubmission(lessonId: string, userId: string) {
      const lesson = await this.lessonService.getLessonById(lessonId);
      if (!lesson) throw new NotFoundException('Lesson not found');
    
      const testId = lesson.test?.id;
      const homeworkId = lesson.homework?.id;
    
      return this.repo.findByUserAndLessonLinks(userId, testId, homeworkId);
    }    
  
    async updateSubmission(id: string, dto: UpdateSubmissionDto): Promise<Submission> {
      try {
        await this.getSubmissionById(id);
        return this.repo.update(id, dto);
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        this.logger.error(messages.DATABASE_UPDATE_ERROR(this.entityName, id), error.stack);
        throw new InternalServerErrorException(messages.DATABASE_UPDATE_ERROR(this.entityName, id));
      }
    }
  
    async deleteSubmission(id: string): Promise<Submission> {
      try {
        await this.getSubmissionById(id);
        return this.repo.delete(id);
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        this.logger.error(messages.DATABASE_DELETE_ERROR(this.entityName, id), error.stack);
        throw new InternalServerErrorException(messages.DATABASE_DELETE_ERROR(this.entityName, id));
      }
    }
  
    async deleteMany(ids: string[]): Promise<number> {
      try {
        return await this.repo.deleteMany(ids);
      } catch (error) {
        this.logger.error(messages.DATABASE_DELETE_ERROR_ARRAY(this.entityName, ids), error.stack);
        throw new InternalServerErrorException(messages.DATABASE_DELETE_ERROR_ARRAY(this.entityName, ids));
      }
    }
  }
  