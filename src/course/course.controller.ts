import { Controller, Get, Post, Body, Param, Patch, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { Multer } from 'multer';
import { CourseService } from './course.service';
import { diskStorage } from "multer";
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("image", {
    storage: diskStorage({
      destination: "./uploads", // Куда сохраняем файлы
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname)); // Генерируем уникальное имя
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Multer.File) {
    return { imageUrl: `/uploads/${file.filename}` }; // Отдаём URL
  }

  @Get('teacher/:id')
  async getCoursesByTeacher(@Param('id') id: string) {
    console.log("Получен teacherId:", id);
    return this.courseService.getCoursesByTeacher(id);
  }


  @Post()
  async create(@Body() { title, description, imageUrl, teacherId }: { title: string; description: string; imageUrl: string; teacherId?: string }) {
    return this.courseService.createCourse(title, description, imageUrl, teacherId);
  }

  @Get()
  async findAll() {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() { title, description, imageUrl, teacherId }: { title: string; description: string; imageUrl: string; teacherId?: string }
  ) {
    return this.courseService.updateCourse(id, title, description, imageUrl, teacherId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}


