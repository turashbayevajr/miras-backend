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
  } from "@nestjs/common";
  import { HomeworkService } from "../service/homework.service";
  import { CreateHomeworkDto } from "./dtos/create-homework.dto";
  import { UpdateHomeworkDto } from "./dtos/update-homework.dto";
  import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";
  
  @ApiTags("Homework")
  @Controller("homework")
  export class HomeworkController {
    constructor(private readonly service: HomeworkService) {}
  
    @Post()
    @ApiOperation({ summary: "Create a new homework" })
    @ApiResponse({ status: 201, description: "Homework created" })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() dto: CreateHomeworkDto) {
      return this.service.createHomework(dto);
    }
  
    @Get()
    @ApiOperation({ summary: "List all homeworks" })
    @ApiResponse({ status: 200, description: "Homeworks listed" })
    async findAll() {
      return this.service.getAllHomeworks();
    }
  
    @Get(":id")
    @ApiOperation({ summary: "Get homework by ID" })
    @ApiParam({ name: "id", type: String })
    @ApiResponse({ status: 200, description: "Homework found" })
    async findOne(@Param("id") id: string) {
      return this.service.getHomeworkById(id);
    }
  
    @Put(":id")
    @ApiOperation({ summary: "Update a homework" })
    @ApiResponse({ status: 200, description: "Homework updated" })
    async update(@Param("id") id: string, @Body() dto: UpdateHomeworkDto) {
      return this.service.updateHomework(id, dto);
    }
  
    @Delete(":id")
    @ApiOperation({ summary: "Delete a homework" })
    @ApiResponse({ status: 200, description: "Homework deleted" })
    async remove(@Param("id") id: string) {
      return this.service.deleteHomework(id);
    }
  
    @Delete()
    @ApiOperation({ summary: "Bulk delete homeworks" })
    @ApiBody({ type: [String], description: "Array of homework IDs" })
    @ApiResponse({ status: 200, description: "Homeworks deleted" })
    async removeMany(@Body() ids: string[]) {
      return this.service.deleteMany(ids);
    }
  }
  