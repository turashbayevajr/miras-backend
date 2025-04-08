import {
    Controller,
    Get,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  import { AnalyticsService } from '../service/analytics.service';
  import { Roles } from '../../auth/roles.decorator';
  import { RolesGuard } from '../../auth/roles.guard';

  
  @ApiTags('Admin Analytics')
  @ApiBearerAuth('access-token')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Controller('admin/analytics')
  export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get platform analytics in a date range' })
    async getAnalytics(
      @Query('from') from?: string,
      @Query('to') to?: string,
    ) {
      const fromDate = from ? new Date(from) : undefined;
      const toDate = to ? new Date(to) : undefined;
  
      return this.analyticsService.getAnalytics({ from: fromDate, to: toDate });
    }
  }
  