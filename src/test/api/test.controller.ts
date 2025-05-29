import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TestService } from '../service/test.service';
import { CreateTestDto } from './dtos/create-test.dto';
import { UpdateTestDto } from './dtos/update-test.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Tests')
@Controller('test')
export class TestController {
  constructor(private readonly service: TestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new test' })
  @ApiResponse({ status: 201, description: 'Test created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateTestDto) {
    return this.service.createTest(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tests' })
  @ApiResponse({ status: 200, description: 'Tests listed' })
  async findAll() {
    return this.service.getAllTests();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get test by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Test found' })
  async findOne(@Param('id') id: string) {
    return this.service.getTestById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a test' })
  @ApiResponse({ status: 200, description: 'Test updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateTestDto) {
    return this.service.updateTest(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a test' })
  @ApiResponse({ status: 200, description: 'Test deleted' })
  async remove(@Param('id') id: string) {
    return this.service.deleteTest(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Bulk delete tests' })
  @ApiBody({ type: [String], description: 'Array of test IDs' })
  @ApiResponse({ status: 200, description: 'Tests deleted' })
  async removeMany(@Body() ids: string[]) {
    return this.service.deleteMany(ids);
  }
}
