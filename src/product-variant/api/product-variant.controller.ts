import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductVariantService } from '../service/product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Product Variants')
@Controller('product-variants')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product variant' })
  @ApiResponse({ status: 201, description: 'Variant created' })
  create(@Body() dto: CreateProductVariantDto) {
    return this.productVariantService.createVariant(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product variants' })
  @ApiResponse({ status: 200, description: 'All variants returned' })
  findAll() {
    return this.productVariantService.getAllVariants();
  }

  @Get('by-product/:productId')
  @ApiOperation({ summary: 'Get variants by product ID' })
  @ApiParam({ name: 'productId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Variants for given product' })
  findByProduct(@Param('productId') productId: string) {
    return this.productVariantService.getVariantsByProduct(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product variant by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Variant found' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  findOne(@Param('id') id: string) {
    return this.productVariantService.getVariantById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product variant' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Variant updated' })
  update(@Param('id') id: string, @Body() dto: UpdateProductVariantDto) {
    return this.productVariantService.updateVariant(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete product variant' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 204, description: 'Variant deleted' })
  delete(@Param('id') id: string) {
    return this.productVariantService.deleteVariant(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Soft delete multiple product variants' })
  @ApiQuery({ name: 'ids', required: true, description: 'Comma-separated variant IDs' })
  @ApiResponse({ status: 200, description: 'Number of variants deleted' })
  deleteMany(@Query('ids') ids: string) {
    const idArray = ids.split(',');
    return this.productVariantService.deleteMultipleVariants(idArray);
  }
}
