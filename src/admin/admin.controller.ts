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
        password: body.password,
        role: body.role,
        plan: "STANDARD"
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