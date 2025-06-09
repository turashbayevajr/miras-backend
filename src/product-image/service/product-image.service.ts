import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProductImageRepository } from '../repository/product-image.repository';
import { CreateProductImageDto } from '../api/dto/create-product-image.dto';
import { UpdateProductImageDto } from '../api/dto/update-product-image.dto';
import { ProductImage } from '../repository/product-image.model';
import messages from '../../configs/messages';

@Injectable()
export class ProductImageService {
  private readonly logger = new Logger(ProductImageService.name);
  private readonly entityName = 'ProductImage';

  constructor(private readonly productImageRepository: ProductImageRepository) {}

  async createImage(dto: CreateProductImageDto): Promise<ProductImage> {
    try {
      return await this.productImageRepository.create(dto);
    } catch (error) {
      this.logger.error(messages.DATABASE_CREATE_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_CREATE_ERROR(this.entityName));
    }
  }

  async getAllImages(): Promise<ProductImage[]> {
    try {
      return await this.productImageRepository.findAll();
    } catch (error) {
      this.logger.error(messages.DATABASE_FETCH_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR(this.entityName));
    }
  }

  async getImagesByProduct(productId: string): Promise<ProductImage[]> {
    try {
      return await this.productImageRepository.findByProductId(productId);
    } catch (error) {
      this.logger.error(
        messages.DATABASE_FETCH_ERROR_BY_FIELD(this.entityName, 'productId', productId),
        error.stack,
      );
      throw new InternalServerErrorException(
        messages.DATABASE_FETCH_ERROR_BY_FIELD(this.entityName, 'productId', productId),
      );
    }
  }

  async getImageById(id: string): Promise<ProductImage> {
    try {
      const image = await this.productImageRepository.findById(id);
      if (!image) {
        throw new NotFoundException(messages.NOT_FOUND_BY_ID(this.entityName, id));
      }
      return image;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id));
    }
  }

  async updateImage(id: string, dto: UpdateProductImageDto): Promise<ProductImage> {
    try {
      await this.getImageById(id);
      return await this.productImageRepository.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(messages.DATABASE_UPDATE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_UPDATE_ERROR(this.entityName, id));
    }
  }

  async deleteImage(id: string): Promise<ProductImage> {
    try {
      await this.getImageById(id);
      return await this.productImageRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(messages.DATABASE_DELETE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_DELETE_ERROR(this.entityName, id));
    }
  }
}
