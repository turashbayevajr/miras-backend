import { Module } from '@nestjs/common';
import { AnalyticsController } from './api/analytics.controller';
import { AnalyticsService } from './service/analytics.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}
