import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { CourseService } from "../service/course.service";
import { CreateCourseDto } from "./dtos/create-course.dto";
import { UpdateCourseDto } from "./dtos/update-course.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";

@ApiTags("Courses")
@Controller("course")
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @Post()
  @ApiOperation({ summary: "Create new course" })
  @ApiResponse({ status: 201, description: "Course created" })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateCourseDto) {
    return this.service.createCourse(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all courses" })
  @ApiResponse({ status: 200, description: "Courses listed" })
  async findAll() {
    return this.service.getAllCourses();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get course by ID" })
  @ApiParam({ name: "id", description: "Course ID", type: String })
  @ApiResponse({ status: 200, description: "Course found" })
  async findOne(@Param("id") id: string) {
    return this.service.getCourseById(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a course" })
  @ApiResponse({ status: 200, description: "Course updated" })
  async update(@Param("id") id: string, @Body() dto: UpdateCourseDto) {
    return this.service.updateCourse(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a course" })
  @ApiResponse({ status: 200, description: "Course deleted" })
  async remove(@Param("id") id: string) {
    return this.service.deleteCourse(id);
  }

  @Delete()
  @ApiOperation({ summary: "Bulk delete courses" })
  @ApiBody({ type: [String], description: "Array of course IDs" })
  @ApiResponse({ status: 200, description: "Courses deleted" })
  async removeMany(@Body() ids: string[]) {
    return this.service.deleteMultipleCourses(ids);
  }
}
