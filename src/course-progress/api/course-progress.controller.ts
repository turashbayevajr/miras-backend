import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CourseProgressService } from '../service/course-progress.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt.guard';

@ApiTags('CourseProgress')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('course-progress')
export class CourseProgressController {
  constructor(private readonly service: CourseProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get course progress for user or course' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'courseId', required: false })
  async getAll(
    @Query('userId') userId?: string,
    @Query('courseId') courseId?: string,
  ) {
    return this.service.findAll({ userId, courseId });
  }
}
