import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductImageService } from '../service/product-image.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Product Images')
@Controller('product-images')
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product image' })
  @ApiResponse({ status: 201, description: 'Image created' })
  create(@Body() dto: CreateProductImageDto) {
    return this.productImageService.createImage(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product images' })
  @ApiResponse({ status: 200, description: 'All product images returned' })
  findAll() {
    return this.productImageService.getAllImages();
  }

  @Get('by-product/:productId')
  @ApiOperation({ summary: 'Get images by product ID' })
  @ApiParam({ name: 'productId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Images for given product' })
  findByProduct(@Param('productId') productId: string) {
    return this.productImageService.getImagesByProduct(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product image by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Image found' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  findOne(@Param('id') id: string) {
    return this.productImageService.getImageById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product image' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Image updated' })
  update(@Param('id') id: string, @Body() dto: UpdateProductImageDto) {
    return this.productImageService.updateImage(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product image' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 204, description: 'Image deleted' })
  delete(@Param('id') id: string) {
    return this.productImageService.deleteImage(id);
  }
}
