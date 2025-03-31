import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
  } from "@nestjs/common";
  import { HomeworkRepository } from "../repository/homework.repository";
  import { CreateHomeworkDto } from "../api/dtos/create-homework.dto";
  import { UpdateHomeworkDto } from "../api/dtos/update-homework.dto";
  import { Homework } from "../repository/homework.model";
  import messages from "../../configs/messages";
  
  @Injectable()
  export class HomeworkService {
    private readonly logger = new Logger(HomeworkService.name);
    private readonly entityName = "Homework";
  
    constructor(private readonly repo: HomeworkRepository) {}
  
    async createHomework(dto: CreateHomeworkDto): Promise<Homework> {
      try {
        const existing = await this.repo.findByLessonId(dto.lessonId);
        if (existing) throw new InternalServerErrorException(messages.ALREADY_EXIST("Homework for this lesson"));
        return await this.repo.create(dto);
      } catch (error) {
        this.logger.error(messages.DATABASE_CREATE_ERROR(this.entityName), error.stack);
        throw new InternalServerErrorException(messages.DATABASE_CREATE_ERROR(this.entityName));
      }
    }
  
    async getAllHomeworks(): Promise<Homework[]> {
      try {
        return this.repo.findAll();
      } catch (error) {
        this.logger.error(messages.DATABASE_FETCH_ERROR(this.entityName), error.stack);
        throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR(this.entityName));
      }
    }
  
    async getHomeworkById(id: string): Promise<Homework> {
      try {
        const hw = await this.repo.findById(id);
        if (!hw) throw new NotFoundException(messages.NOT_FOUND_BY_ID(this.entityName, id));
        return hw;
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        this.logger.error(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id), error.stack);
        throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id));
      }
    }
  
    async updateHomework(id: string, dto: UpdateHomeworkDto): Promise<Homework> {
      try {
        await this.getHomeworkById(id);
        return await this.repo.update(id, dto);
      } catch (error) {
        if (error instanceof NotFoundException) throw error;
        this.logger.error(messages.DATABASE_UPDATE_ERROR(this.entityName, id), error.stack);
        throw new InternalServerErrorException(messages.DATABASE_UPDATE_ERROR(this.entityName, id));
      }
    }
  
    async deleteHomework(id: string): Promise<Homework> {
      try {
        await this.getHomeworkById(id);
        return await this.repo.delete(id);
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
  