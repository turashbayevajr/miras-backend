import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Role, Plan } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Post('users')
  createUser(
    @Body() body: { fullName: string; email: string; password: string; role: Role }
  ) {
    return this.adminService.createUser(body);
  }

  @Patch('users/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: Partial<{ fullName: string; email: string; password: string; plan: Plan ;role: Role }>
  ) {
    return this.adminService.updateUser(id, body);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
