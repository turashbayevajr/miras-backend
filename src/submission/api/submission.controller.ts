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
    Query,
  } from "@nestjs/common";
  import { SubmissionService } from "../service/submission.service";
  import { CreateSubmissionDto } from "./dtos/create-submission.dto";
  import { UpdateSubmissionDto } from "./dtos/update-submission.dto";
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";
  
  @ApiTags("Submissions")
  @Controller("submission")
  export class SubmissionController {
    constructor(private readonly service: SubmissionService) {}
  
    @Post()
    @ApiOperation({ summary: "Submit homework or test" })
    @ApiResponse({ status: 201, description: "Submission created" })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() dto: CreateSubmissionDto) {
      return this.service.createSubmission(dto);
    }
  
    @Get()
    @ApiOperation({ summary: "List all submissions" })
    @ApiResponse({ status: 200, description: "Submissions listed" })
    async findAll() {
      return this.service.getAllSubmissions();
    }
    @Get('check')
    @ApiOperation({ summary: 'Check if user has submitted for this lesson' })
    @ApiResponse({ status: 200, description: 'Submission found or null' })
    async checkSubmission(
    @Query('lessonId') lessonId: string,
    @Query('userId') userId: string,
    ) {
    return this.service.checkUserSubmission(lessonId, userId);
    }
  
    @Get(":id")
    @ApiOperation({ summary: "Get submission by ID" })
    @ApiParam({ name: "id", type: String })
    @ApiResponse({ status: 200, description: "Submission found" })
    async findOne(@Param("id") id: string) {
      return this.service.getSubmissionById(id);
    }
  
    @Put(":id")
    @ApiOperation({ summary: "Update a submission" })
    @ApiResponse({ status: 200, description: "Submission updated" })
    async update(@Param("id") id: string, @Body() dto: UpdateSubmissionDto) {
      return this.service.updateSubmission(id, dto);
    }
  
    @Delete(":id")
    @ApiOperation({ summary: "Delete a submission" })
    @ApiResponse({ status: 200, description: "Submission deleted" })
    async remove(@Param("id") id: string) {
      return this.service.deleteSubmission(id);
    }
  
    @Delete()
    @ApiOperation({ summary: "Bulk delete submissions" })
    @ApiBody({ type: [String], description: "Array of submission IDs" })
    @ApiResponse({ status: 200, description: "Submissions deleted" })
    async removeMany(@Body() ids: string[]) {
      return this.service.deleteMany(ids);
    }
  }
  