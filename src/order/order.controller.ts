import { Controller, Post, Get, Param, Delete, Body, Patch } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() body: { title: string; description: string; employeeId?: string }) {
    return this.orderService.createOrder(body.title, body.description, body.employeeId);
  }


  @Get()
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id/assign')
  assignEmployee(@Param('id') id: string, @Body() body: { employeeId: string }) {
    return this.orderService.assignEmployee(id, body.employeeId);
  }

  @Patch(':id')
  updateOrder(@Param('id') id: string, @Body() body: { title?: string; description?: string; employeeId?: string }) {
    return this.orderService.updateOrder(id, body);
  }


  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }
}
