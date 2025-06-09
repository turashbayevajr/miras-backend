import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SizeRepository } from '../repository/size.repository';
import { CreateSizeDto } from '../api/dto/create-size.dto';
import { UpdateSizeDto } from '../api/dto/update-size.dto';
import { Size } from '../repository/size.model';
import messages from '../../configs/messages';

@Injectable()
export class SizeService {
  private readonly logger = new Logger(SizeService.name);
  private readonly entityName = 'Size';

  constructor(private readonly sizeRepository: SizeRepository) {}

  async create(dto: CreateSizeDto): Promise<Size> {
    try {
      return await this.sizeRepository.create(dto);
    } catch (error) {
      this.logger.error(messages.DATABASE_CREATE_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_CREATE_ERROR(this.entityName));
    }
  }

  async findAll(): Promise<Size[]> {
    try {
      return await this.sizeRepository.findAll();
    } catch (error) {
      this.logger.error(messages.DATABASE_FETCH_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR(this.entityName));
    }
  }

  async findById(id: string): Promise<Size> {
    try {
      const size = await this.sizeRepository.findById(id);
      if (!size) {
        throw new NotFoundException(messages.NOT_FOUND_BY_ID(this.entityName, id));
      }
      return size;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id));
    }
  }

  async update(id: string, dto: UpdateSizeDto): Promise<Size> {
    try {
      await this.findById(id);
      return await this.sizeRepository.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(messages.DATABASE_UPDATE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_UPDATE_ERROR(this.entityName, id));
    }
  }

  async delete(id: string): Promise<Size> {
    try {
      await this.findById(id);
      return await this.sizeRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(messages.DATABASE_DELETE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_DELETE_ERROR(this.entityName, id));
    }
  }
}
