import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repository/analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly repo: AnalyticsRepository) {}

  async getAnalytics({
    from,
    to,
  }: {
    from?: Date;
    to?: Date;
  }) {
    const plans = ['STANDARD', 'PREMIUM', 'ENTERPRISE'] as const;
    const stats: Record<string, any> = {};

    for (const plan of plans) {
      stats[plan] = await this.repo.getPlanStats(plan, from, to);
    }

    const topByEnrollment = await this.repo.getTopCoursesByEnrollment(from, to);
    const topBySubmissions = await this.repo.getTopCoursesBySubmissions(from, to);

    const overall = await this.repo.getOverallStats(from, to);

    return {
      plans: stats,
      topCoursesByEnrollment: topByEnrollment,
      topCoursesBySubmissions: topBySubmissions,
      overall,
    };
  }
}
