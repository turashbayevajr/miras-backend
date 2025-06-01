import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UnauthorizedException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CourseService } from '../service/course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CourseDto } from './dtos/course.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('Courses')
@Controller('course')
export class CourseController {
  constructor(
    private readonly service: CourseService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a course' })
  @ApiResponse({ status: 201, description: 'Course created' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async createCourse(@Body() dto: CreateCourseDto, @Request() req) {
    const userId = req.user.sub;
    return this.service.createCourse({ ...dto, creatorId: userId });
  }

  @Get()
  @ApiOperation({ summary: 'List all courses' })
  @ApiResponse({ status: 200, description: 'Courses listed' })
  async findAll() {
    return this.service.getAllCourses();
  }
  @Get('teacher')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all teacher-related courses' })
  @ApiResponse({ status: 200, description: 'Courses listed' })
  async findTeacherCourses(@Request() req) {
    const userId = req.user.sub;
    const courses = await this.service.getTeacherCourses(userId);
    return courses;
  }
  @Get('teacher/:id')
  @ApiOperation({ summary: 'List all teacher-related courses' })
  @ApiResponse({ status: 200, description: 'Courses listed' })
  async findTeacherCoursesById(@Param('id') id: string) {
    return await this.service.getTeacherCourses(id);
  }
  @Get('my-course/:id')
  @ApiOperation({ summary: 'List all courses the user is enrolled in' })
  @ApiResponse({ status: 200, description: 'Courses listed' })
  async findMyCourses(@Param('id') id: string) {
    return await this.service.getMyCourses(id);
  }
  @Get('my-pending/:id')
  @ApiOperation({ summary: 'List all courses the user is enrolled in' })
  @ApiResponse({ status: 200, description: 'Courses listed' })
  async findMyPending(@Param('id') id: string) {
    return await this.service.getMyPendingCourses(id);
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get course by ID and include student submissions' })
  @ApiParam({ name: 'id', description: 'Course ID', type: String })
  @ApiResponse({ status: 200, description: 'Course found with lesson results' })
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    return await this.service.getCourseById(id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({ status: 200, description: 'Course updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return await this.service.updateCourse(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 200, description: 'Course deleted' })
  async remove(@Param('id') id: string) {
    return await this.service.deleteCourse(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Bulk delete courses' })
  @ApiBody({ type: [String], description: 'Array of course IDs' })
  @ApiResponse({ status: 200, description: 'Courses deleted' })
  async removeMany(@Body() ids: string[]) {
    return await this.service.deleteMultipleCourses(ids);
  }
}
