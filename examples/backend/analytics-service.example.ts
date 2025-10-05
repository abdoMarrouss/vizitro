import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

/**
 * Analytics query DTO
 */
export class AnalyticsQueryDto {
  apiKey: string;
  startDate?: string;
  endDate?: string;
  page?: number = 1;
  limit?: number = 50;
}

/**
 * Analytics response DTOs
 */
export class OverviewResponseDto {
  totalVisits: number;
  uniqueVisitors: number;
  totalPageViews: number;
  avgPageViewsPerVisitor: number;
  topCountry: string;
  topBrowser: string;
  topDevice: string;
}

export class PageStatsDto {
  url: string;
  views: number;
  uniqueVisitors: number;
}

export class CountryStatsDto {
  country: string;
  countryCode: string;
  visitors: number;
  percentage: number;
}

/**
 * Main analytics service - aggregates data for dashboard
 */
@Injectable()
export class AnalyticsService {
  constructor(
    private apiKeysService: ApiKeysService,
    private overviewService: OverviewService,
    private pagesService: PagesService,
    private countriesService: CountriesService,
  ) {}

  /**
   * Get overview statistics
   */
  async getOverview(userId: string, query: AnalyticsQueryDto) {
    const apiKey = await this.validateApiKey(query.apiKey, userId);
    const { startDate, endDate } = this.parseDateRange(query);

    return this.overviewService.getOverview(apiKey.id, startDate, endDate);
  }

  /**
   * Get top pages
   */
  async getTopPages(userId: string, query: AnalyticsQueryDto) {
    const apiKey = await this.validateApiKey(query.apiKey, userId);
    const { startDate, endDate } = this.parseDateRange(query);

    return this.pagesService.getTopPages(
      apiKey.id, 
      startDate, 
      endDate, 
      query.limit || 10
    );
  }

  /**
   * Get country breakdown
   */
  async getCountryStats(userId: string, query: AnalyticsQueryDto) {
    const apiKey = await this.validateApiKey(query.apiKey, userId);
    const { startDate, endDate } = this.parseDateRange(query);

    return this.countriesService.getCountryStats(
      apiKey.id, 
      startDate, 
      endDate, 
      query.limit || 20
    );
  }

  private async validateApiKey(apiKeyId: string, userId: string) {
    const apiKey = await this.apiKeysService.findOne(apiKeyId, userId);
    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }
    return apiKey;
  }

  private parseDateRange(query: AnalyticsQueryDto) {
    if (query.startDate && query.endDate) {
      return {
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
      };
    }
    return {};
  }
}

/**
 * Overview service - summary statistics
 */
@Injectable()
export class OverviewService {
  constructor(
    @InjectRepository(Visitor)
    private visitorsRepository: Repository<Visitor>,
    @InjectRepository(PageView)
    private pageViewsRepository: Repository<PageView>,
  ) {}

  async getOverview(
    apiKeyId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<OverviewResponseDto> {
    const dateFilter = this.buildDateFilter(startDate, endDate);

    // Get unique visitors count
    const uniqueVisitors = await this.visitorsRepository.count({
      where: { apiKeyId, ...dateFilter },
    });

    // Get total visits (sum of visitCount)
    const visitorsData = await this.visitorsRepository.find({
      where: { apiKeyId, ...dateFilter },
      select: ['visitCount'],
    });
    const totalVisits = visitorsData.reduce((sum, v) => sum + v.visitCount, 0);

    // Get total page views
    const totalPageViews = await this.pageViewsRepository.count({
      where: {
        apiKeyId,
        ...(startDate && endDate ? { timestamp: Between(startDate, endDate) } : {}),
      },
    });

    // Calculate average page views per visitor
    const avgPageViewsPerVisitor =
      uniqueVisitors > 0 
        ? Math.round((totalPageViews / uniqueVisitors) * 10) / 10 
        : 0;

    // Get top country
    const topCountryResult = await this.visitorsRepository
      .createQueryBuilder('visitor')
      .select('visitor.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .where('visitor.apiKeyId = :apiKeyId', { apiKeyId })
      .andWhere('visitor.country IS NOT NULL')
      .groupBy('visitor.country')
      .orderBy('count', 'DESC')
      .limit(1)
      .getRawOne();

    // Get top browser
    const topBrowserResult = await this.visitorsRepository
      .createQueryBuilder('visitor')
      .select('visitor.browser', 'browser')
      .addSelect('COUNT(*)', 'count')
      .where('visitor.apiKeyId = :apiKeyId', { apiKeyId })
      .groupBy('visitor.browser')
      .orderBy('count', 'DESC')
      .limit(1)
      .getRawOne();

    // Get top device
    const topDeviceResult = await this.visitorsRepository
      .createQueryBuilder('visitor')
      .select('visitor.device', 'device')
      .addSelect('COUNT(*)', 'count')
      .where('visitor.apiKeyId = :apiKeyId', { apiKeyId })
      .groupBy('visitor.device')
      .orderBy('count', 'DESC')
      .limit(1)
      .getRawOne();

    return {
      totalVisits,
      uniqueVisitors,
      totalPageViews,
      avgPageViewsPerVisitor,
      topCountry: topCountryResult?.country || 'N/A',
      topBrowser: topBrowserResult?.browser || 'N/A',
      topDevice: topDeviceResult?.device || 'N/A',
    };
  }

  private buildDateFilter(startDate?: Date, endDate?: Date) {
    if (startDate && endDate) {
      return { firstVisit: Between(startDate, endDate) };
    }
    return {};
  }
}

/**
 * Pages service - top pages analytics
 */
@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(PageView)
    private pageViewsRepository: Repository<PageView>,
  ) {}

  async getTopPages(
    apiKeyId: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 10,
  ): Promise<PageStatsDto[]> {
    const query = this.pageViewsRepository
      .createQueryBuilder('pageView')
      .select('pageView.url', 'url')
      .addSelect('COUNT(*)', 'views')
      .addSelect('COUNT(DISTINCT pageView.visitorId)', 'uniqueVisitors')
      .where('pageView.apiKeyId = :apiKeyId', { apiKeyId });

    if (startDate && endDate) {
      query.andWhere('pageView.timestamp BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const results = await query
      .groupBy('pageView.url')
      .orderBy('views', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map((r) => ({
      url: r.url,
      views: parseInt(r.views),
      uniqueVisitors: parseInt(r.uniqueVisitors),
    }));
  }
}