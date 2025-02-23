import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { CourseModule } from './course/course.module';
import { OrderModule } from './order/order.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PrismaModule, EnrollmentModule, CourseModule, OrderModule, AdminModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
