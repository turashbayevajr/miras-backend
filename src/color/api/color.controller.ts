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
} from '@nestjs/common';
import { ColorService } from '../service/color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Colors')
@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new color' })
  @ApiResponse({ status: 201, description: 'Color created successfully' })
  create(@Body() dto: CreateColorDto) {
    return this.colorService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all colors' })
  @ApiResponse({ status: 200, description: 'List of colors' })
  findAll() {
    return this.colorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get color by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Color found' })
  @ApiResponse({ status: 404, description: 'Color not found' })
  findOne(@Param('id') id: string) {
    return this.colorService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update color by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Color updated successfully' })
  update(@Param('id') id: string, @Body() dto: UpdateColorDto) {
    return this.colorService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete color by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 204, description: 'Color deleted successfully' })
  delete(@Param('id') id: string) {
    return this.colorService.delete(id);
  }
}
