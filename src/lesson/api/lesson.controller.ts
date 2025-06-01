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
import { LessonService } from '../service/lesson.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Lessons')
@Controller('lesson')
export class LessonController {
  constructor(private readonly service: LessonService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiResponse({ status: 201, description: 'Lesson created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateLessonDto) {
    return this.service.createLesson(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all lessons' })
  @ApiResponse({ status: 200, description: 'Lessons listed' })
  async findAll() {
    return this.service.getAllLessons();
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'List all lessons' })
  @ApiResponse({ status: 200, description: 'Lessons listed' })
  async findCourseLessons(@Param('courseId') courseId: string) {
    return this.service.getLessonsByCourse(courseId);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Lesson found' })
  async findOne(@Param('id') id: string) {
    return this.service.getLessonById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.service.updateLesson(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson deleted' })
  async remove(@Param('id') id: string) {
    return this.service.deleteLesson(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Bulk delete lessons' })
  @ApiBody({ type: [String], description: 'Array of lesson IDs' })
  @ApiResponse({ status: 200, description: 'Lessons deleted' })
  async removeMany(@Body() ids: string[]) {
    return this.service.deleteMany(ids);
  }
}
