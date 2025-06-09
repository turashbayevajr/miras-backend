import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ColorRepository } from '../repository/color.repository';
import { CreateColorDto } from '../api/dto/create-color.dto';
import { UpdateColorDto } from '../api/dto/update-color.dto';
import { Color } from '../repository/color.model';
import messages from '../../configs/messages';

@Injectable()
export class ColorService {
  private readonly logger = new Logger(ColorService.name);
  private readonly entityName = 'Color';

  constructor(private readonly colorRepository: ColorRepository) {}

  async create(dto: CreateColorDto): Promise<Color> {
    try {
      return await this.colorRepository.create(dto);
    } catch (error) {
      this.logger.error(messages.DATABASE_CREATE_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_CREATE_ERROR(this.entityName));
    }
  }

  async findAll(): Promise<Color[]> {
    try {
      return await this.colorRepository.findAll();
    } catch (error) {
      this.logger.error(messages.DATABASE_FETCH_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR(this.entityName));
    }
  }

  async findById(id: string): Promise<Color> {
    try {
      const color = await this.colorRepository.findById(id);
      if (!color) {
        throw new NotFoundException(messages.NOT_FOUND_BY_ID(this.entityName, id));
      }
      return color;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id));
    }
  }

  async update(id: string, dto: UpdateColorDto): Promise<Color> {
    try {
      await this.findById(id);
      return await this.colorRepository.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(messages.DATABASE_UPDATE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_UPDATE_ERROR(this.entityName, id));
    }
  }

  async delete(id: string): Promise<Color> {
    try {
      await this.findById(id);
      return await this.colorRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(messages.DATABASE_DELETE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_DELETE_ERROR(this.entityName, id));
    }
  }
}
