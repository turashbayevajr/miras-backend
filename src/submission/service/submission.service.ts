import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
  } from "@nestjs/common";
  import { SubmissionRepository } from "../repository/submission.repository";
  import { CreateSubmissionDto } from "../api/dtos/create-submission.dto";
  import { UpdateSubmissionDto } from "../api/dtos/update-submission.dto";
  import { Submission } from "../repository/submission.model";
  import messages from "../../configs/messages";
  
  @Injectable()
  export class SubmissionService {
    private readonly logger = new Logger(SubmissionService.name);
    private readonly entityName = "Submission";
  
    constructor(private readonly repo: SubmissionRepository) {}
  
    async createSubmission(dto: CreateSubmissionDto): Promise<Submission> {
      try {
        return await this.repo.create(dto);
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
  