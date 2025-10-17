import { Component, OnInit, signal, effect, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { 
  ChartComponent, 
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexGrid,
  ApexTooltip,
  ApexFill,
  NgApexchartsModule 
} from "ng-apexcharts";
import { AnalyticsService } from '../../core/services/analytics.service';
import { ApiKeysService } from '../../core/services/api-keys.service';
import { DatePickerComponent } from '../../shared/components/date-picker.component';
import { NumberFormatPipe } from '../../shared/pipes';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  fill: ApexFill;
  colors: string[];
};

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePickerComponent, NumberFormatPipe, NgApexchartsModule],
  template: `
    <div class="p-4 md:p-6 space-y-4 md:space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 class="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">Analytics Overview</h1>
          <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Track your website performance in real-time</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            (click)="refreshData()"
            [disabled]="loading()"
            class="flex items-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#262626] text-gray-700 dark:text-gray-300 rounded-lg hover:border-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4" [class.animate-spin]="loading()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="text-xs md:text-sm font-medium hidden sm:inline">Refresh</span>
          </button>
          <app-date-picker (rangeChange)="onDateRangeChange($event)" />
        </div>
      </div>

      @if (loading() && !overview()) {
        <div class="flex items-center justify-center py-20">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      } @else if (selectedApiKey() && overview()) {
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <!-- Unique Visitors -->
          <div class="group relative bg-white dark:bg-[#121212] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#262626] hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-purple-500/10">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-2 md:mb-3">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Unique Visitors</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ overview()!.uniqueVisitors | numberFormat }}</p>
            </div>
          </div>

          <!-- Total Visits -->
          <div class="group relative bg-white dark:bg-[#121212] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#262626] hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-violet-500/10">
            <div class="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-2 md:mb-3">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Visits</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ overview()!.totalVisits | numberFormat }}</p>
            </div>
          </div>

          <!-- Page Views -->
          <div class="group relative bg-white dark:bg-[#121212] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#262626] hover:border-pink-500/50 dark:hover:border-pink-500/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-pink-500/10">
            <div class="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-2 md:mb-3">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Page Views</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ overview()!.totalPageViews | numberFormat }}</p>
            </div>
          </div>

          <!-- Avg Views -->
          <div class="group relative bg-white dark:bg-[#121212] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#262626] hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-purple-500/10">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-2 md:mb-3">
                <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg. Views/Visitor</p>
              <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{{ overview()!.avgPageViewsPerVisitor }}</p>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="bg-white dark:bg-[#121212] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#262626] shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">Visitor Trends</h3>
            <div class="flex items-center gap-2 text-xs">
              <span class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 animate-pulse"></span>
              <span class="text-gray-500 dark:text-gray-400">Live</span>
            </div>
          </div>
          
          @if (chartOptions()) {
            <div id="chart">
              <apx-chart
                [series]="chartOptions()!.series"
                [chart]="chartOptions()!.chart"
                [xaxis]="chartOptions()!.xaxis"
                [stroke]="chartOptions()!.stroke"
                [dataLabels]="chartOptions()!.dataLabels"
                [yaxis]="chartOptions()!.yaxis"
                [grid]="chartOptions()!.grid"
                [tooltip]="chartOptions()!.tooltip"
                [fill]="chartOptions()!.fill"
                [colors]="chartOptions()!.colors"
              ></apx-chart>
            </div>
          } @else {
            <div class="h-64 flex items-center justify-center">
              <div class="text-center">
                <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-500/50 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Loading chart...</p>
              </div>
            </div>
          }
        </div>

         <!-- Top Pages & Sources -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Top Pages -->
          <div class="bg-white dark:bg-[#121212] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#262626] shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">Top Pages</h3>
              <span class="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 font-medium">Live</span>
            </div>
            @if (topPages().length > 0) {
              <div class="space-y-2">
                @for (page of topPages(); track page.url; let i = $index) {
                  <div class="group p-3 rounded-lg bg-gray-50 dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#262626] transition-all duration-200">
                    <div class="flex justify-between items-center mb-1.5">
                      <span class="text-xs md:text-sm font-medium truncate flex-1 text-gray-700 dark:text-gray-300 group-hover:text-purple-500 transition-colors">{{ page.url }}</span>
                      <div class="flex items-center gap-2 ml-3">
                        <span class="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{{ page.views }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ (page.views / topPages()[0].views * 100).toFixed(1) }}%</span>
                      </div>
                    </div>
                    <div class="h-1.5 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500"
                           [ngClass]="i === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : i === 1 ? 'bg-gradient-to-r from-violet-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-violet-500'"
                           [style.width.%]="(page.views / topPages()[0].views) * 100">
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-8">
                <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">No page data yet</p>
              </div>
            }
          </div>

         <!-- Traffic Sources -->
<div class="bg-white dark:bg-[#121212] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#262626] shadow-sm">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">Traffic Sources</h3>
    <span class="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20 font-medium">Active</span>
  </div>
  @if (topReferrers().length > 0) {
    <div class="space-y-2">
      @for (ref of topReferrers(); track ref.referrer) {
        <div class="group p-3 rounded-lg bg-gray-50 dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#262626] transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5 flex-1 min-w-0">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" [ngClass]="getSourceBgClass(ref.referrer)">
                <span [innerHTML]="getSourceSvgIcon(ref.referrer)"></span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs md:text-sm font-medium truncate text-gray-700 dark:text-gray-300 group-hover:text-violet-500 transition-colors">{{ ref.referrer }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-3">
              <span class="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{{ ref.visits }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ ref.percentage }}%</span>
            </div>
          </div>
        </div>
      }
    </div>
  } @else {
    <div class="text-center py-8">
      <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center">
        <svg class="w-6 h-6 text-violet-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">No referrer data yet</p>
    </div>
  }
</div>
        </div>

        <!-- Locations, Devices, Browsers - 3 Columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Locations -->
          <div class="bg-white dark:bg-[#121212] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#262626] shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">Top Locations</h3>
              <span class="text-xs px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 font-medium">Geo</span>
            </div>
            @if (countries().length > 0) {
              <div class="space-y-2">
                @for (country of countries().slice(0, 5); track country.country) {
                  <div class="group p-3 rounded-lg bg-gray-50 dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#262626] transition-all duration-200">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-xs md:text-sm font-medium truncate flex-1 text-gray-700 dark:text-gray-300 group-hover:text-pink-500 transition-colors">{{ country.country }}</span>
                      <div class="flex items-center gap-2 ml-3">
                        <span class="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{{ country.visitors }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ country.percentage }}%</span>
                      </div>
                    </div>
                    <div class="h-1.5 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                           [style.width.%]="country.percentage">
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-6">
                <p class="text-xs text-gray-500 dark:text-gray-400">No location data yet</p>
              </div>
            }
          </div>

          <!-- Devices -->
          <div class="bg-white dark:bg-[#121212] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#262626] shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">Devices</h3>
              <span class="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/20 font-medium">Tech</span>
            </div>
            @if (devices().length > 0) {
              <div class="space-y-2">
                @for (device of devices(); track device.device) {
                  <div class="group p-3 rounded-lg bg-gray-50 dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#262626] transition-all duration-200">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-xs md:text-sm font-medium truncate flex-1 text-gray-700 dark:text-gray-300 group-hover:text-violet-500 transition-colors">{{ device.device }}</span>
                      <div class="flex items-center gap-2 ml-3">
                        <span class="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{{ device.visitors }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ device.percentage }}%</span>
                      </div>
                    </div>
                    <div class="h-1.5 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                           [style.width.%]="device.percentage">
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-6">
                <p class="text-xs text-gray-500 dark:text-gray-400">No device data yet</p>
              </div>
            }
          </div>

          <!-- Browsers -->
          <div class="bg-white dark:bg-[#121212] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#262626] shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">Browsers</h3>
              <span class="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 font-medium">Web</span>
            </div>
            @if (browsers().length > 0) {
              <div class="space-y-2">
                @for (browser of browsers().slice(0, 5); track browser.browser) {
                  <div class="group p-3 rounded-lg bg-gray-50 dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#262626] transition-all duration-200">
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="text-xs md:text-sm font-medium truncate flex-1 text-gray-700 dark:text-gray-300 group-hover:text-purple-500 transition-colors">{{ browser.browser }}</span>
                      <div class="flex items-center gap-2 ml-3">
                        <span class="text-xs md:text-sm font-bold text-gray-900 dark:text-white">{{ browser.visitors }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ browser.percentage }}%</span>
                      </div>
                    </div>
                    <div class="h-1.5 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                           [style.width.%]="browser.percentage">
                      </div>
                    </div>
                  </div>
                }
              </div>} @else {
              <div class="text-center py-6">
                <p class="text-xs text-gray-500 dark:text-gray-400">No browser data yet</p>
              </div>
            }
          </div>
        </div>

      } @else {
        <div class="text-center py-16">
          <div class="max-w-md mx-auto px-4">
            <div class="w-20 h-20 mx-auto mb-5 rounded-xl bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-pink-500/10 flex items-center justify-center">
              <svg class="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">No API Key Selected</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Create an API key to start tracking your website visitors</p>
            <a routerLink="/dashboard/api-keys" class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white text-sm rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create API Key
            </a>
          </div>
        </div>
      }
    </div>
  `
})
export class OverviewComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  
  overview = signal<any>(null);
  topPages = signal<any[]>([]);
  topReferrers = signal<any[]>([]);
  countries = signal<any[]>([]);
  devices = signal<any[]>([]);
  browsers = signal<any[]>([]);
  loading = signal(false);
  dateRange = { start: '', end: '' };
  selectedApiKey = this.apiKeysService.selectedApiKey;
  chartOptions = signal<ChartOptions | null>(null);

  constructor(
    private analyticsService: AnalyticsService,
    private apiKeysService: ApiKeysService,
    private sanitizer: DomSanitizer

  ) {
    effect(() => {
      const apiKey = this.selectedApiKey();
      if (apiKey) {
        this.loadData();
      }
    });
  }

  ngOnInit() {
    if (this.selectedApiKey()) {
      this.loadData();
    }
  }

  loadData() {
    const apiKey = this.selectedApiKey();
    if (!apiKey) return;

    this.loading.set(true);

    // Load overview
    this.analyticsService.getOverview(apiKey.id, this.dateRange.start, this.dateRange.end)
      .subscribe({
        next: (res) => {
          this.overview.set(res.data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });

    // Load visitors to build chart from their timestamps
   // Load visitors to build chart with date range
this.analyticsService.getVisitors(apiKey.id, 1, 1000, this.dateRange.start, this.dateRange.end).subscribe({
  next: (res) => {
    console.log('Visitors API response:', res);
    const visitorsData = res.data?.data || res.data || [];
    this.buildChartFromVisitors(visitorsData);
  },
  error: (err) => {
    console.error('Error loading visitors:', err);
    this.initChart(
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      [0, 0, 0, 0, 0, 0, 0]
    );
  }
});

    // Load top pages
    this.analyticsService.getTopPages(apiKey.id).subscribe({
      next: (res) => this.topPages.set(res.data)
    });

    // Load top referrers
    this.analyticsService.getTopReferrers(apiKey.id).subscribe({
      next: (res) => this.topReferrers.set(res.data)
    });

    // Load countries
    this.analyticsService.getTopCountries(apiKey.id).subscribe({
      next: (res) => {
        const total = res.data.reduce((sum: number, item: any) => sum + item.visitors, 0);
        const countriesWithPercentage = res.data.map((item: any) => ({
          ...item,
          percentage: ((item.visitors / total) * 100).toFixed(1)
        }));
        this.countries.set(countriesWithPercentage);
      }
    });

    // Load devices
    this.analyticsService.getTopDevices(apiKey.id).subscribe({
      next: (res) => {
        const total = res.data.reduce((sum: number, item: any) => sum + item.visitors, 0);
        const devicesWithPercentage = res.data.map((item: any) => ({
          ...item,
          percentage: ((item.visitors / total) * 100).toFixed(1)
        }));
        this.devices.set(devicesWithPercentage);
      }
    });

    // Load browsers
    this.analyticsService.getTopBrowsers(apiKey.id).subscribe({
      next: (res) => {
        const total = res.data.reduce((sum: number, item: any) => sum + item.visitors, 0);
        const browsersWithPercentage = res.data.map((item: any) => ({
          ...item,
          percentage: ((item.visitors / total) * 100).toFixed(1)
        }));
        this.browsers.set(browsersWithPercentage);
      }
    });
  }

buildChartFromVisitors(visitors: any[]) {
  console.log('Visitors received:', visitors);
  
  if (!visitors || visitors.length === 0) {
    this.initChart(
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      [0, 0, 0, 0, 0, 0, 0]
    );
    return;
  }

  // Filter by date range if set
  let filteredVisitors = visitors;
  if (this.dateRange.start && this.dateRange.end) {
    const startDate = new Date(this.dateRange.start);
    const endDate = new Date(this.dateRange.end);
    
    filteredVisitors = visitors.filter(visitor => {
      const visitDate = new Date(visitor.lastVisit || visitor.firstVisit);
      return visitDate >= startDate && visitDate <= endDate;
    });
  }

  // Group visitors by date
  const visitorsByDate: { [key: string]: number } = {};
  
  filteredVisitors.forEach(visitor => {
    const timestamp = visitor.lastVisit || visitor.firstVisit;
    
    if (timestamp) {
      const date = new Date(timestamp);
      const dateKey = date.toISOString().split('T')[0];
      visitorsByDate[dateKey] = (visitorsByDate[dateKey] || 0) + 1;
    }
  });

  // Determine date range for chart
  let startDate: Date, endDate: Date;
  
  if (this.dateRange.start && this.dateRange.end) {
    startDate = new Date(this.dateRange.start);
    endDate = new Date(this.dateRange.end);
  } else {
    // Default to last 7 days
    endDate = new Date();
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
  }

  // Generate categories and data for the date range
  const chartData = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    chartData.push({
      label: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: visitorsByDate[dateKey] || 0
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const categories = chartData.map(d => d.label);
  const data = chartData.map(d => d.count);

  this.initChart(categories, data);
}

  initChart(categories: string[], data: number[]) {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  this.chartOptions.set({
    series: [
      {
        name: "Visitors",
        data: data
      }
    ],
    chart: {
      height: 280,
      type: "area",
      toolbar: {
        show: false
      },
      background: 'transparent',
      animations: {
        enabled: true,
        speed: 800,
      },
      zoom: {
        enabled: false  // Disable zoom
      },
      selection: {
        enabled: false  // Disable selection
      }
    },
    colors: ['#a855f7'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        // colorStops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: "#a855f7",
            opacity: 0.7
          },
          {
            offset: 50,
            color: "#8b5cf6",
            opacity: 0.5
          },
          {
            offset: 100,
            color: "#ec4899",
            opacity: 0.2
          }
        ]
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: isDarkMode ? '#9ca3af' : '#6b7280',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: isDarkMode ? '#9ca3af' : '#6b7280',
          fontSize: '12px'
        },
        formatter: function (val) {
          return Math.floor(val).toString();
        }
      }
    },
    grid: {
      borderColor: isDarkMode ? '#1f2937' : '#e5e7eb',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10
      }
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light',
      x: {
        show: true
      },
      y: {
        formatter: function (val) {
          return val + " visitors";
        }
      },
      style: {
        fontSize: '12px'
      }
    }
  });
}

  refreshData() {
    this.loadData();
  }

  onDateRangeChange(range: { start: string; end: string }) {
    this.dateRange = range;
    this.loadData();
  }

  getSourceIcon(referrer: string): string {
    const ref = referrer.toLowerCase();
    if (ref.includes('google')) return '🔍';
    if (ref.includes('facebook')) return '👥';
    if (ref.includes('twitter') || ref.includes('x.com')) return '🐦';
    if (ref.includes('github')) return '💻';
    if (ref.includes('linkedin')) return '💼';
    if (ref.includes('youtube')) return '📺';
    if (ref.includes('instagram')) return '📸';
    if (ref.includes('direct')) return '🔗';
    return '🌐';
  }

getSourceBgClass(referrer: string): string {
  if (!referrer) return 'bg-gray-500/10';
  
  const ref = referrer.toLowerCase();
  
  // Filter internal referrers
  if (ref.includes('localhost') || ref.includes('127.0.0.1') || ref.includes('direct')) {
    return 'bg-gray-500/10';
  }
  
  // Extract domain
  let domain = '';
  try {
    const url = new URL(referrer);
    domain = url.hostname.replace('www.', '').toLowerCase();
  } catch {
    domain = ref;
  }
  
  if (domain.includes('google')) return 'bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-700';
  if (domain.includes('facebook')) return 'bg-[#1877F2]/10';
  if (domain.includes('twitter') || domain.includes('x.com')) return 'bg-black dark:bg-white';
  if (domain.includes('github')) return 'bg-gray-900 dark:bg-gray-100';
  if (domain.includes('linkedin')) return 'bg-[#0A66C2]/10';
  if (domain.includes('youtube')) return 'bg-red-500/10';
  if (domain.includes('instagram')) return 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10';
  
  return 'bg-gray-500/10';
}
getSourceSvgIcon(referrer: string): SafeHtml {
  if (!referrer) {
    return this.getDirectIcon();
  }
  
  const ref = referrer.toLowerCase();
  
  // Filter out internal/localhost referrers - treat as direct
  if (ref.includes('localhost') || ref.includes('127.0.0.1') || ref.includes('direct')) {
    return this.getDirectIcon();
  }
  
  // Extract domain name for better matching
  let domain = '';
  try {
    const url = new URL(referrer);
    domain = url.hostname.replace('www.', '').toLowerCase();
  } catch {
    domain = ref;
  }
  
  if (domain.includes('google')) {
    return this.getGoogleIcon();
  } else if (domain.includes('facebook')) {
    return this.getFacebookIcon();
  } else if (domain.includes('twitter') || domain.includes('x.com')) {
    return this.getTwitterIcon();
  } else if (domain.includes('github')) {
    return this.getGithubIcon();
  } else if (domain.includes('linkedin')) {
    return this.getLinkedinIcon();
  } else if (domain.includes('youtube')) {
    return this.getYoutubeIcon();
  } else if (domain.includes('instagram')) {
    return this.getInstagramIcon();
  }
  
  return this.getDirectIcon();
}

// Split into separate methods for cleaner code
private getDirectIcon(): SafeHtml {
  const svg = `<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>`;
  return this.sanitizer.bypassSecurityTrustHtml(svg);
}

private getGoogleIcon(): SafeHtml {
  const svg = `<svg class="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>`;
  return this.sanitizer.bypassSecurityTrustHtml(svg);
}

private getFacebookIcon(): SafeHtml {
  const svg = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>`;
  return this.sanitizer.bypassSecurityTrustHtml(svg);
}

private getTwitterIcon(): SafeHtml {
  const svg = `<svg class="w-4 h-4 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>`;
  return this.sanitizer.bypassSecurityTrustHtml(svg);
}

private getGithubIcon(): SafeHtml {
  const svg = `<svg class="w-5 h-5 text-white dark:text-gray-900" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>`;
  return this.sanitizer.bypassSecurityTrustHtml(svg);
}

private getLinkedinIcon(): SafeHtml {
  const svg = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>`;
  return this.sanitizer.bypassSecurityTrustHtml(svg);
}

private getYoutubeIcon(): SafeHtml {
  const svg = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="#FF0000">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>`;
  return this.sanitizer.bypassSecurityTrustHtml(svg);
}

private getInstagramIcon(): SafeHtml {
  const svg = `<svg class="w-5 h-5" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#833AB4" />
        <stop offset="50%" style="stop-color:#E1306C" />
        <stop offset="100%" style="stop-color:#FCAF45" />
      </linearGradient>
    </defs>
    <path fill="url(#ig-grad)" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
  </svg>`;
  return this.sanitizer.bypassSecurityTrustHtml(svg);
}
}