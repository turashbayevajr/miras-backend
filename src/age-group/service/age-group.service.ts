import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AgeGroupRepository } from '../repository/age-group.repository';
import { CreateAgeGroupDto } from '../api/dto/create-age-group.dto';
import { UpdateAgeGroupDto } from '../api/dto/update-age-group.dto';
import { AgeGroup } from '../repository/age-group.model';
import messages from '../../configs/messages';

@Injectable()
export class AgeGroupService {
  private readonly logger = new Logger(AgeGroupService.name);
  private readonly entityName = 'AgeGroup';

  constructor(private readonly ageGroupRepository: AgeGroupRepository) {}

  async create(dto: CreateAgeGroupDto): Promise<AgeGroup> {
    try {
      return await this.ageGroupRepository.create(dto);
    } catch (error) {
      this.logger.error(messages.DATABASE_CREATE_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_CREATE_ERROR(this.entityName));
    }
  }

  async findAll(): Promise<AgeGroup[]> {
    try {
      return await this.ageGroupRepository.findAll();
    } catch (error) {
      this.logger.error(messages.DATABASE_FETCH_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR(this.entityName));
    }
  }

  async findById(id: string): Promise<AgeGroup> {
    try {
      const ageGroup = await this.ageGroupRepository.findById(id);
      if (!ageGroup) {
        throw new NotFoundException(messages.NOT_FOUND_BY_ID(this.entityName, id));
      }
      return ageGroup;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id));
    }
  }

  async update(id: string, dto: UpdateAgeGroupDto): Promise<AgeGroup> {
    try {
      await this.findById(id);
      return await this.ageGroupRepository.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(messages.DATABASE_UPDATE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_UPDATE_ERROR(this.entityName, id));
    }
  }

  async delete(id: string): Promise<AgeGroup> {
    try {
      await this.findById(id);
      return await this.ageGroupRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(messages.DATABASE_DELETE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_DELETE_ERROR(this.entityName, id));
    }
  }
}
