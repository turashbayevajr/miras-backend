import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SizeService } from '../service/size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Sizes')
@Controller('sizes')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new size' })
  @ApiResponse({ status: 201, description: 'Size created' })
  create(@Body() dto: CreateSizeDto) {
    return this.sizeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sizes' })
  @ApiResponse({ status: 200, description: 'List of sizes' })
  findAll() {
    return this.sizeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get size by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Size found' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  findOne(@Param('id') id: string) {
    return this.sizeService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update size by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Size updated' })
  update(@Param('id') id: string, @Body() dto: UpdateSizeDto) {
    return this.sizeService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete size by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 204, description: 'Size deleted' })
  delete(@Param('id') id: string) {
    return this.sizeService.delete(id);
  }
}
