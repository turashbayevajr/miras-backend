import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe, Req, UnauthorizedException } from "@nestjs/common";
import { CourseService } from "../service/course.service";
import { CreateCourseDto } from "./dtos/create-course.dto";
import { UpdateCourseDto } from "./dtos/update-course.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";
import { CourseDto } from "./dtos/course.dto";
import { JwtService } from "@nestjs/jwt";

@ApiTags("Courses")
@Controller("course")
export class CourseController {
  constructor(
    private readonly service: CourseService,
    private readonly jwtService: JwtService) {}

  @Post()
  @ApiOperation({ summary: "Create a course" })
  @ApiResponse({ status: 201, description: "Course created" })
  async createCourse(@Body() dto: CreateCourseDto, @Req() request: Request) {
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Bearer <token>
  
    if (!token) throw new UnauthorizedException('Missing token');
  
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  
    const userId = payload.sub;
    return this.service.createCourse({ ...dto, creatorId: userId });
  }


  @Get()
  @ApiOperation({ summary: "List all courses" })
  @ApiResponse({ status: 200, description: "Courses listed" })
  async findAll() {
    return this.service.getAllCourses();
  }
  @Get("my-course/:id")
  @ApiOperation({ summary: "List all courses the user is enrolled in" })
  @ApiResponse({ status: 200, description: "Courses listed" })
  async findMyCourses(@Param("id") id: string) {
    return this.service.getMyCourses(id);
  }
  @Get("my-pending/:id")
  @ApiOperation({ summary: "List all courses the user is enrolled in" })
  @ApiResponse({ status: 200, description: "Courses listed" })
  async findMyPending(@Param("id") id: string) {
    return this.service.getMyPendingCourses(id);
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
