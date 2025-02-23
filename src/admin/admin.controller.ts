import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Получить всех пользователей
  @Get('users')
  async getUsers() {
    return this.prisma.user.findMany();
  }

  // 2. Создать нового пользователя
  @Post('users')
  async createUser(
    @Body() body: { fullName: string; email: string; password: string; role: Role }
  ) {
    return this.prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password, // ⚠️ Нужно будет хешировать перед сохранением
        role: body.role,
      },
    });
  }

  // 3. Обновить данные пользователя
  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() body: Partial<{ fullName: string; email: string; password: string; role: Role }>) {
    return this.prisma.user.update({
      where: { id },
      data: body,
    });
  }

  // 4. Удалить пользователя
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}

@Controller('admin/courses')
export class AdminCoursesController {
  constructor(private prisma: PrismaService) {}

  // Получить все курсы
  @Get()
  async getAllCourses() {
    return this.prisma.course.findMany();
  }

  // Создать новый курс
  @Post()
  async createCourse(@Body() body: { title: string; description: string; imageUrl: string }) {
    return this.prisma.course.create({ data: body });
  }

  // Обновить курс
  @Patch(':id')
  async updateCourse(@Param('id') id: string, @Body() body: Partial<{ title: string; description: string; imageUrl: string }>) {
    return this.prisma.course.update({ where: { id }, data: body });
  }

  // Удалить курс
  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return this.prisma.course.delete({ where: { id } });
  }
}

@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async createOrder(@Body() body: { title: string; description: string; employeeId?: string }) {
    return this.prisma.order.create({ data: body });
  }

  @Get()
  async getAllOrders() {
    return this.prisma.order.findMany({ include: { employee: true } });
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.prisma.order.findUnique({ where: { id }, include: { employee: true } });
  }

  @Patch(':id/assign')
  async assignEmployee(@Param('id') id: string, @Body() body: { employeeId: string }) {
    return this.prisma.order.update({ where: { id }, data: { employeeId: body.employeeId } });
  }

  @Patch(':id')
  async updateOrder(@Param('id') id: string, @Body() body: { title?: string; description?: string; employeeId?: string }) {
    return this.prisma.order.update({ where: { id }, data: body });
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}