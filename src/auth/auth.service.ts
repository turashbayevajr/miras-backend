import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import messages from '../configs/messages';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async hashToken(token: string) {
    return await bcrypt.hash(token, 10);
  }

  async validateUser(phone: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) throw new UnauthorizedException(messages.INVALID_CREDENTIALS);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException(messages.INVALID_CREDENTIALS);

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.phone, dto.password);
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashed = await this.hashToken(refreshToken);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashed },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existing) throw new ConflictException(messages.ALREADY_EXIST('phone'));

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        password: hashedPassword,
        role: dto.role,
      },
    });

    const payload = {
      sub: newUser.id,
      fullName: newUser.fullName,
      phone: newUser.phone,
      role: newUser.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashed = await this.hashToken(refreshToken);
    await this.prisma.user.update({
      where: { id: newUser.id },
      data: { refreshToken: hashed },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        phone: newUser.phone,
        role: newUser.role,
      },
    };
  }

  async refreshTokens(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(token, user.refreshToken);
    if (!isMatch) throw new UnauthorizedException();

    const payload = {
      sub: user.id,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
    };
    const newAccess = this.jwtService.sign(payload, { expiresIn: '15m' });
    const newRefresh = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: await this.hashToken(newRefresh) },
    });

    return { accessToken: newAccess, refreshToken: newRefresh };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
