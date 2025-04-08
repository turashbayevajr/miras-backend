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
    Query
  } from "@nestjs/common";
  import { EnrollmentService } from "../service/enrollment.service";
  import { CreateEnrollmentDto } from "./dtos/create-enrollment.dto";
  import { UpdateEnrollmentDto } from "./dtos/update-enrollment.dto";
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";
  
  @ApiTags("Enrollments")
  @Controller("enrollment")
  export class EnrollmentController {
    constructor(private readonly service: EnrollmentService) {}
  
    @Post()
    @ApiOperation({ summary: "Enroll a user in a course" })
    @ApiResponse({ status: 201, description: "Enrollment created" })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() dto: CreateEnrollmentDto) {
      return this.service.createEnrollment(dto);
    }
  
    @Get()
    @ApiOperation({ summary: "List all enrollments" })
    @ApiResponse({ status: 200, description: "List of enrollments" })
    async findAll() {
      return this.service.getAllEnrollments();
    }
  
    @Get("check")
    @ApiOperation({ summary: 'Check if user has already enrolled for this course' })
    @ApiResponse({ status: 200, description: 'Enrollment found or null' })
    async getByUser(
    @Query('userId') userId: string,
    ) {
    return this.service.findByUser(userId);
    }
  
    @Get(":id")
    @ApiOperation({ summary: "Get enrollment by ID" })
    @ApiParam({ name: "id", description: "Enrollment ID", type: String })
    @ApiResponse({ status: 200, description: "Enrollment found" })
    async findOne(@Param("id") id: string) {
      return this.service.getEnrollmentById(id);
    }
  
    @Put(":id")
    @ApiOperation({ summary: "Update enrollment" })
    @ApiResponse({ status: 200, description: "Enrollment updated" })
    async update(@Param("id") id: string, @Body() dto: UpdateEnrollmentDto) {
      return this.service.updateEnrollment(id, dto);
    }
  
    @Delete(":id")
    @ApiOperation({ summary: "Delete enrollment" })
    @ApiResponse({ status: 200, description: "Enrollment deleted" })
    async remove(@Param("id") id: string) {
      return this.service.deleteEnrollment(id);
    }
  
    @Delete()
    @ApiOperation({ summary: "Bulk delete enrollments" })
    @ApiBody({ type: [String], description: "Array of enrollment IDs" })
    @ApiResponse({ status: 200, description: "Enrollments deleted" })
    async removeMany(@Body() ids: string[]) {
      return this.service.deleteMultiple(ids);
    }
  }
  