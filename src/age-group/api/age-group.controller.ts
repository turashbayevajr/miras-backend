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
import { AgeGroupService } from '../service/age-group.service';
import { CreateAgeGroupDto } from './dto/create-age-group.dto';
import { UpdateAgeGroupDto } from './dto/update-age-group.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Age Groups')
@Controller('age-groups')
export class AgeGroupController {
  constructor(private readonly ageGroupService: AgeGroupService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new age group' })
  @ApiResponse({ status: 201, description: 'Age group created' })
  create(@Body() dto: CreateAgeGroupDto) {
    return this.ageGroupService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all age groups' })
  @ApiResponse({ status: 200, description: 'List of age groups' })
  findAll() {
    return this.ageGroupService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get age group by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Age group found' })
  @ApiResponse({ status: 404, description: 'Age group not found' })
  findOne(@Param('id') id: string) {
    return this.ageGroupService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update age group by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Age group updated' })
  update(@Param('id') id: string, @Body() dto: UpdateAgeGroupDto) {
    return this.ageGroupService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete age group by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 204, description: 'Age group deleted' })
  delete(@Param('id') id: string) {
    return this.ageGroupService.delete(id);
  }
}
