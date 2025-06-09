import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProductVariantRepository } from '../repository/product-variant.repository';
import { CreateProductVariantDto } from '../api/dto/create-product-variant.dto';
import { UpdateProductVariantDto } from '../api/dto/update-product-variant.dto';
import { ProductVariant } from '../repository/product-variant.model';
import messages from '../../configs/messages';

@Injectable()
export class ProductVariantService {
  private readonly logger = new Logger(ProductVariantService.name);
  private readonly entityName = 'ProductVariant';

  constructor(private readonly repository: ProductVariantRepository) {}

  async createVariant(dto: CreateProductVariantDto): Promise<ProductVariant> {
    try {
      return await this.repository.create(dto);
    } catch (error) {
      this.logger.error(messages.DATABASE_CREATE_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_CREATE_ERROR(this.entityName));
    }
  }

  async getAllVariants(): Promise<ProductVariant[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      this.logger.error(messages.DATABASE_FETCH_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR(this.entityName));
    }
  }

  async getVariantsByProduct(productId: string): Promise<ProductVariant[]> {
    try {
      return await this.repository.findByProductId(productId);
    } catch (error) {
      this.logger.error(messages.DATABASE_FETCH_ERROR_BY_FIELD(this.entityName, 'productId', productId), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR_BY_FIELD(this.entityName, 'productId', productId));
    }
  }

  async getVariantById(id: string): Promise<ProductVariant> {
    try {
      const variant = await this.repository.findById(id);
      if (!variant) {
        throw new NotFoundException(messages.NOT_FOUND_BY_ID(this.entityName, id));
      }
      return variant;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id));
    }
  }

  async updateVariant(id: string, dto: UpdateProductVariantDto): Promise<ProductVariant> {
    try {
      await this.getVariantById(id);
      return await this.repository.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(messages.DATABASE_UPDATE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_UPDATE_ERROR(this.entityName, id));
    }
  }

  async deleteVariant(id: string): Promise<ProductVariant> {
    try {
      await this.getVariantById(id);
      return await this.repository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(messages.DATABASE_DELETE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_DELETE_ERROR(this.entityName, id));
    }
  }

  async deleteMultipleVariants(ids: string[]): Promise<number> {
    try {
      return await this.repository.deleteMany(ids);
    } catch (error) {
      this.logger.error(messages.DATABASE_DELETE_ERROR_ARRAY(this.entityName, ids), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_DELETE_ERROR_ARRAY(this.entityName, ids));
    }
  }
}
