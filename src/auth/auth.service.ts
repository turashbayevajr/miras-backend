import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private configService: ConfigService) {}

  async register(fullName: string, email: string, password: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: role as Role,
      },
    });
  }

  async login(email: string, password: string) {
    // Ищем пользователя в базе
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Неверный email или пароль');

    // Генерируем JWT-токен
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.configService.get<string>('JWT_SECRET') || 'default_secret',
      { expiresIn: '7d' }
    );

    return { token, user, role: user.role };
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }
  
}
