import { Controller, Post, Body, Req, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

/**
 * DTO for tracking visitor data
 */
export class TrackVisitorDto {
  apiKey: string;
  url: string;
  referrer?: string;
  userAgent?: string;
  screenWidth?: number;
  screenHeight?: number;
  language?: string;
  sessionId?: string;
}

/**
 * Main tracking controller - handles visitor tracking requests
 */
@Controller('track')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  async track(@Body() trackData: TrackVisitorDto, @Req() request: Request) {
    const ipAddress = this.getClientIp(request);
    return this.trackingService.track(trackData, ipAddress);
  }

  /**
   * Extract real IP address from request
   * Handles proxies and load balancers
   */
  private getClientIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      return (forwarded as string).split(',')[0].trim();
    }

    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      return realIp as string;
    }

    return request.ip || request.socket.remoteAddress || 'unknown';
  }
}

/**
 * Tracking service - core business logic
 */
@Injectable()
export class TrackingService {
  constructor(
    private apiKeysService: ApiKeysService,
    private visitorsService: VisitorsService,
    private pageViewsService: PageViewsService,
    private geoLocationService: GeoLocationService,
    private userAgentParserService: UserAgentParserService,
  ) {}

  async track(trackData: TrackVisitorDto, ipAddress: string) {
    // 1. Validate API key
    const apiKey = await this.apiKeysService.findByKey(trackData.apiKey);
    if (!apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    // 2. Get geo-location data from IP
    const geoData = await this.geoLocationService.getLocationFromIp(ipAddress);

    // 3. Parse user agent to detect browser/OS/device
    const userAgentData = this.userAgentParserService.parseUserAgent(
      trackData.userAgent || '',
    );

    // 4. Check if visitor already exists (by IP + API key)
    let visitor = await this.visitorsService.findByIpAndApiKey(
      ipAddress,
      apiKey.id,
    );

    if (visitor) {
      // Existing visitor - increment visit count
      await this.visitorsService.incrementVisitCount(visitor.id);
    } else {
      // New visitor - create record
      visitor = await this.visitorsService.create({
        apiKeyId: apiKey.id,
        ipAddress,
        country: geoData?.country || 'Unknown',
        countryCode: geoData?.countryCode || 'XX',
        region: geoData?.region || 'Unknown',
        city: geoData?.city || 'Unknown',
        timezone: geoData?.timezone || 'UTC',
        latitude: geoData?.latitude || 0,
        longitude: geoData?.longitude || 0,
        isp: geoData?.isp || 'Unknown',
        userAgent: trackData.userAgent || 'Unknown',
        browser: userAgentData.browser,
        browserVersion: userAgentData.browserVersion,
        os: userAgentData.os,
        osVersion: userAgentData.osVersion,
        device: userAgentData.device,
        visitCount: 1,
        referrer: trackData.referrer || null,
        landingPage: trackData.url,
      });
    }

    // 5. Save page view record
    await this.pageViewsService.create({
      visitorId: visitor.id,
      apiKeyId: apiKey.id,
      url: trackData.url,
      referrer: trackData.referrer || null,
      sessionId: trackData.sessionId || null,
      screenWidth: trackData.screenWidth || null,
      screenHeight: trackData.screenHeight || null,
      language: trackData.language || null,
    });

    return {
      success: true,
      message: 'Tracking data recorded successfully',
    };
  }
}

/**
 * Geo-location service - IP to location mapping
 */
@Injectable()
export class GeoLocationService {
  async getLocationFromIp(ipAddress: string): Promise<GeoLocationData | null> {
    // Skip for localhost/private IPs
    if (
      ipAddress === '::1' ||
      ipAddress === '127.0.0.1' ||
      ipAddress.startsWith('192.168.') ||
      ipAddress.startsWith('10.')
    ) {
      return {
        country: 'Local',
        countryCode: 'LOCAL',
        region: 'NULL',
        city: 'Localhost',
        timezone: 'NULL',
        latitude: 0,
        longitude: 0,
        isp: 'NULL',
      };
    }

    try {
      // Using ip-api.com (free tier: 45 requests/minute)
      const response = await axios.get(
        `http://ip-api.com/json/${ipAddress}?fields=status,country,countryCode,region,city,timezone,lat,lon,isp`,
        { timeout: 3000 },
      );

      if (response.data.status === 'success') {
        return {
          country: response.data.country || 'Unknown',
          countryCode: response.data.countryCode || 'XX',
          region: response.data.region || 'Unknown',
          city: response.data.city || 'Unknown',
          timezone: response.data.timezone || 'UTC',
          latitude: response.data.lat || 0,
          longitude: response.data.lon || 0,
          isp: response.data.isp || 'Unknown',
        };
      }

      return null;
    } catch (error) {
      console.error('Geo-location lookup failed:', error.message);
      return null;
    }
  }
}

/**
 * User agent parser - browser/OS/device detection
 */
@Injectable()
export class UserAgentParserService {
  parseUserAgent(userAgentString: string): ParsedUserAgent {
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();

    return {
      browser: result.browser.name || 'Unknown',
      browserVersion: result.browser.version || 'Unknown',
      os: result.os.name || 'Unknown',
      osVersion: result.os.version || 'Unknown',
      device: this.getDeviceType(result),
    };
  }

  private getDeviceType(result: any): string {
    if (result.device.type === 'mobile') return 'Mobile';
    if (result.device.type === 'tablet') return 'Tablet';
    return 'Desktop';
  }
}

interface GeoLocationData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
  latitude: number;
  longitude: number;
  isp: string;
}

interface ParsedUserAgent {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
}