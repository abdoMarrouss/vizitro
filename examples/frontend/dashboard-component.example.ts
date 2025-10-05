import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Analytics service - handles API communication
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = 'https://api.vizitro.com';

  constructor(private http: HttpClient) {}

  getOverview(apiKey: string, startDate?: string, endDate?: string): Observable<any> {
    const params: any = { apiKey };
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }
    return this.http.get(`${this.apiUrl}/analytics/overview`, { params });
  }

  getTopPages(apiKey: string, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/pages`, {
      params: { apiKey, limit: limit.toString() }
    });
  }

  getCountries(apiKey: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/countries`, {
      params: { apiKey }
    });
  }

  getDevices(apiKey: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/devices`, {
      params: { apiKey }
    });
  }

  getReferrers(apiKey: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/referrers`, {
      params: { apiKey }
    });
  }

  getVisitors(apiKey: string, page: number = 1, limit: number = 50): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/visitors`, {
      params: { apiKey, page: page.toString(), limit: limit.toString() }
    });
  }
}

/**
 * Main dashboard component with Tailwind CSS
 */
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header with date picker -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div class="relative">
          <select 
            [(ngModel)]="dateRange" 
            (change)="onDateRangeChange()"
            class="block w-48 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="today">Today</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="custom">Custom range</option>
          </select>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" *ngIf="overview$ | async as overview">
        <div class="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
          <div class="flex-shrink-0 text-4xl">👥</div>
          <div>
            <h3 class="text-sm font-medium text-gray-500">Total Visits</h3>
            <p class="text-2xl font-bold text-gray-900">{{ overview.totalVisits | number }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
          <div class="flex-shrink-0 text-4xl">👤</div>
          <div>
            <h3 class="text-sm font-medium text-gray-500">Unique Visitors</h3>
            <p class="text-2xl font-bold text-gray-900">{{ overview.uniqueVisitors | number }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
          <div class="flex-shrink-0 text-4xl">📄</div>
          <div>
            <h3 class="text-sm font-medium text-gray-500">Page Views</h3>
            <p class="text-2xl font-bold text-gray-900">{{ overview.totalPageViews | number }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
          <div class="flex-shrink-0 text-4xl">📊</div>
          <div>
            <h3 class="text-sm font-medium text-gray-500">Avg. Views/Visitor</h3>
            <p class="text-2xl font-bold text-gray-900">{{ overview.avgPageViewsPerVisitor }}</p>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Top Pages -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div *ngIf="topPages$ | async as pages">
            <apx-chart
              [series]="getPagesChartData(pages).series"
              [chart]="getPagesChartData(pages).chart"
              [xaxis]="getPagesChartData(pages).xaxis">
            </apx-chart>
          </div>
        </div>

        <!-- Traffic Sources -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div *ngIf="referrers$ | async as referrers">
            <apx-chart
              [series]="getReferrersChartData(referrers)"
              [chart]="{ type: 'pie', height: 350 }"
              [labels]="getReferrersLabels(referrers)">
            </apx-chart>
          </div>
        </div>
      </div>

      <!-- Geographic Distribution -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <div *ngIf="countries$ | async as countries">
          <apx-chart
            [series]="getCountriesChartData(countries).series"
            [chart]="getCountriesChartData(countries).chart"
            [xaxis]="getCountriesChartData(countries).xaxis">
          </apx-chart>
        </div>
      </div>

      <!-- Device Breakdown & Recent Visitors -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
          <div *ngIf="devices$ | async as devices">
            <apx-chart
              [series]="getDevicesChartData(devices)"
              [chart]="{ type: 'donut', height: 350 }"
              [labels]="getDevicesLabels(devices)">
            </apx-chart>
          </div>
        </div>

        <!-- Recent Visitors Table -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Visitors</h3>
          <div class="overflow-x-auto" *ngIf="visitors$ | async as visitorsData">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visits</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let visitor of visitorsData.data.slice(0, 5)" class="hover:bg-gray-50">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ visitor.country }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ visitor.city }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ visitor.device }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ visitor.visitCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  selectedApiKey: string;
  dateRange: string = '7days';
  
  overview$: Observable<any>;
  topPages$: Observable<any>;
  countries$: Observable<any>;
  devices$: Observable<any>;
  referrers$: Observable<any>;
  visitors$: Observable<any>;

  constructor(private analyticsService: AnalyticsService) {
    // Get API key from user's profile or selection
    this.selectedApiKey = 'user-api-key-here';
  }

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    const { startDate, endDate } = this.getDateRange();
    
    this.overview$ = this.analyticsService.getOverview(
      this.selectedApiKey, 
      startDate, 
      endDate
    );
    
    this.topPages$ = this.analyticsService.getTopPages(this.selectedApiKey);
    this.countries$ = this.analyticsService.getCountries(this.selectedApiKey);
    this.devices$ = this.analyticsService.getDevices(this.selectedApiKey);
    this.referrers$ = this.analyticsService.getReferrers(this.selectedApiKey);
    this.visitors$ = this.analyticsService.getVisitors(this.selectedApiKey);
  }

  onDateRangeChange() {
    this.loadAnalytics();
  }

  getDateRange() {
    const now = new Date();
    const endDate = now.toISOString();
    let startDate: string;

    switch (this.dateRange) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        break;
      case '7days':
        startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
        break;
      case '30days':
        startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
        break;
      default:
        return {};
    }

    return { startDate, endDate };
  }

  // Chart configuration helpers
  getPagesChartData(pages: any[]) {
    return {
      series: [{
        name: 'Views',
        data: pages.map(p => p.views)
      }],
      chart: {
        type: 'bar',
        height: 350
      },
      xaxis: {
        categories: pages.map(p => this.formatUrl(p.url))
      }
    };
  }

  getCountriesChartData(countries: any[]) {
    return {
      series: [{
        name: 'Visitors',
        data: countries.map(c => c.visitors)
      }],
      chart: {
        type: 'bar',
        height: 350
      },
      xaxis: {
        categories: countries.map(c => c.country)
      }
    };
  }

  getReferrersChartData(referrers: any[]) {
    return referrers.map(r => r.visits);
  }

  getReferrersLabels(referrers: any[]) {
    return referrers.map(r => r.referrer);
  }

  getDevicesChartData(devices: any[]) {
    return devices.map(d => d.visitors);
  }

  getDevicesLabels(devices: any[]) {
    return devices.map(d => d.device);
  }

  formatUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  }
}