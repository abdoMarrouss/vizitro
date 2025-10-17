import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  AnalyticsOverview, 
  PageStats, 
  ReferrerStats, 
  CountryStats, 
  DeviceStats,
  BrowserStats,
  Visitor,
  ApiResponse 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOverview(apiKeyId: string | null | undefined, startDate?: string, endDate?: string): Observable<ApiResponse<AnalyticsOverview>> {
    if (!apiKeyId) return EMPTY;
    
    const params: any = { apiKey: apiKeyId };
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }
    return this.http.get<ApiResponse<AnalyticsOverview>>(`${this.apiUrl}/analytics/overview`, { params });
  }

  getTopPages(apiKeyId: string | null | undefined, limit: number = 10): Observable<ApiResponse<PageStats[]>> {
    if (!apiKeyId) return EMPTY;
    
    return this.http.get<ApiResponse<PageStats[]>>(`${this.apiUrl}/analytics/pages`, {
      params: { apiKey: apiKeyId, limit: limit.toString() }
    });
  }

  getTopReferrers(apiKeyId: string | null | undefined, limit: number = 10): Observable<ApiResponse<ReferrerStats[]>> {
    if (!apiKeyId) return EMPTY;
    
    return this.http.get<ApiResponse<ReferrerStats[]>>(`${this.apiUrl}/analytics/referrers`, {
      params: { apiKey: apiKeyId, limit: limit.toString() }
    });
  }

  getTopCountries(apiKeyId: string | null | undefined): Observable<ApiResponse<CountryStats[]>> {
    if (!apiKeyId) return EMPTY;
    
    return this.http.get<ApiResponse<CountryStats[]>>(`${this.apiUrl}/analytics/countries`, {
      params: { apiKey: apiKeyId }
    });
  }

  getTopDevices(apiKeyId: string | null | undefined): Observable<ApiResponse<DeviceStats[]>> {
    if (!apiKeyId) return EMPTY;
    
    return this.http.get<ApiResponse<DeviceStats[]>>(`${this.apiUrl}/analytics/devices`, {
      params: { apiKey: apiKeyId }
    });
  }

  getTopBrowsers(apiKeyId: string | null | undefined): Observable<ApiResponse<BrowserStats[]>> {
    if (!apiKeyId) return EMPTY;
    
    return this.http.get<ApiResponse<BrowserStats[]>>(`${this.apiUrl}/analytics/browsers`, {
      params: { apiKey: apiKeyId }
    });
  }

  // In analytics.service.ts
getVisitors(apiKeyId: string | null | undefined, page: number = 1, limit: number = 50, startDate?: string, endDate?: string): Observable<ApiResponse<{ data: Visitor[], total: number }>> {
  if (!apiKeyId) return EMPTY;
  
  const params: any = { 
    apiKey: apiKeyId, 
    page: page.toString(), 
    limit: limit.toString() 
  };
  
  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  
  return this.http.get<ApiResponse<{ data: Visitor[], total: number }>>(`${this.apiUrl}/analytics/visitors`, {
    params
  });
}
}