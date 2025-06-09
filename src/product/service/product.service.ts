import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { Product } from '../repository/product.model';
import { CreateProductDto } from '../api/dto/create-product.dto';
import { UpdateProductDto } from '../api/dto/update-product.dto';
import messages from '../../configs/messages';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private readonly entityName = 'Product';

  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(dto: CreateProductDto): Promise<Product> {
    try {
      return await this.productRepository.create(dto);
    } catch (error) {
      this.logger.error(messages.DATABASE_CREATE_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_CREATE_ERROR(this.entityName));
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.productRepository.findAll();
    } catch (error) {
      this.logger.error(messages.DATABASE_FETCH_ERROR(this.entityName), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR(this.entityName));
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) {
        throw new NotFoundException(messages.NOT_FOUND_BY_ID(this.entityName, id));
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_FETCH_ERROR_BY_ID(this.entityName, id));
    }
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    try {
      await this.getProductById(id);
      return await this.productRepository.update(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(messages.DATABASE_UPDATE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_UPDATE_ERROR(this.entityName, id));
    }
  }

  async deleteProduct(id: string): Promise<Product> {
    try {
      await this.getProductById(id);
      return await this.productRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error(messages.DATABASE_DELETE_ERROR(this.entityName, id), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_DELETE_ERROR(this.entityName, id));
    }
  }

  async deleteMultipleProducts(ids: string[]): Promise<number> {
    try {
      return await this.productRepository.deleteMany(ids);
    } catch (error) {
      this.logger.error(messages.DATABASE_DELETE_ERROR_ARRAY(this.entityName, ids), error.stack);
      throw new InternalServerErrorException(messages.DATABASE_DELETE_ERROR_ARRAY(this.entityName, ids));
    }
  }
}
