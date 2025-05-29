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
} from '@nestjs/common';
import { SubmissionService } from '../service/submission.service';
import { CreateSubmissionDto } from './dtos/create-submission.dto';
import { UpdateSubmissionDto } from './dtos/update-submission.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { SubmissionQueryDto } from './dtos/submission-query.dto';

@ApiTags('Submissions')
@Controller('submission')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) {}

  @Post()
  @ApiOperation({ summary: 'Submit homework or test' })
  @ApiResponse({ status: 201, description: 'Submission created' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateSubmissionDto) {
    return this.service.createSubmission(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all submissions' })
  @ApiResponse({ status: 200, description: 'Submissions listed' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'lessonId', required: false })
  @ApiQuery({ name: 'courseId', required: false })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'ISO string start date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'ISO string end date',
  })
  async findAll(@Query() query: SubmissionQueryDto) {
  return this.service.getAllSubmissions(query);
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

  @Get(':id')
  @ApiOperation({ summary: 'Get submission by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Submission found' })
  async findOne(@Param('id') id: string) {
    return this.service.getSubmissionById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a submission' })
  @ApiResponse({ status: 200, description: 'Submission updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.service.updateSubmission(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a submission' })
  @ApiResponse({ status: 200, description: 'Submission deleted' })
  async remove(@Param('id') id: string) {
    return this.service.deleteSubmission(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Bulk delete submissions' })
  @ApiBody({ type: [String], description: 'Array of submission IDs' })
  @ApiResponse({ status: 200, description: 'Submissions deleted' })
  async removeMany(@Body() ids: string[]) {
    return this.service.deleteMany(ids);
  }
}
