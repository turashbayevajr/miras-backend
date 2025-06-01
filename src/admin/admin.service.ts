import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import messages from 'src/configs/messages';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    try {
      return await this.prisma.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }
    async getTeachers() {
    try {
      return await this.prisma.user.findMany({
        where: {
          role: "TEACHER"
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }
  async getUser(id: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async createUser(data: {
    fullName: string;
    email: string;
    password: string;
    role: Role;
  }) {
    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          plan: 'STANDARD',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }
  private async hashToken(token: string) {
    return await bcrypt.hash(token, 10);
  }

  async updateUser(
    id: string,
    data: Partial<{
      fullName: string;
      email: string;
      password: string;
      role: Role;
    }>,
  ) {
    try {
      const existing = await this.prisma.user.findUnique({ where: { id } });
      if (!existing)
        throw new NotFoundException(messages.NOT_FOUND_BY_ID('User', id));

      const updateData = { ...data };
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }

      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        messages.DATABASE_UPDATE_ERROR('User', id),
      );
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
