import { Module } from '@nestjs/common';
import { AnalyticsController } from './api/analytics.controller';
import { AnalyticsService } from './service/analytics.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalyticsRepository } from './repository/analytics.repository';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AnalyticsRepository,PrismaService],
  exports: [AnalyticsRepository,PrismaService]
})
export class AnalyticsModule {}
