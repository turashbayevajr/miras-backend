import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: { fullName: string; email: string; password: string; role: string }) {
    return this.authService.register(dto.fullName, dto.email, dto.password, dto.role);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('users')
  getUsers() {
    return this.authService.getUsers();
  }
}
