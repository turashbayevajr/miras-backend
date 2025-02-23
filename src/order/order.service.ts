import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(title: string, description: string, employeeId?: string) {
    return this.prisma.order.create({
      data: {
        title,
        description,
        employeeId: employeeId || null,
      },
    });
  }
  

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: { employee: true },
    });
  }

  async getOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { employee: true },
    });
  }

  async assignEmployee(orderId: string, employeeId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { employeeId },
    });
  }

  async updateOrder(id: string, data: { title?: string; description?: string; employeeId?: string }) {
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }
  

  async deleteOrder(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}
