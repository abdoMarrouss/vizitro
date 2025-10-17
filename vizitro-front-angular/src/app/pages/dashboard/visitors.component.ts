import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ApiKeysService } from '../../core/services/api-keys.service';
import { TimeAgoPipe } from '../../shared/pipes';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  template: `
    <div class="p-4 md:p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">Visitors</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Real-time visitor tracking and analytics</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span class="text-sm font-medium text-purple-500">{{ visitors().length }} Total</span>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-20">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      } @else if (visitors().length > 0) {
        <!-- Desktop Table -->
        <div class="hidden lg:block bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-[#262626] overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-[#262626]">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Visitor</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Country</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">City</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Browser</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">OS</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Device</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Visits</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Last Visit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-[#262626]">
                @for (visitor of visitors(); track visitor.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-[#0A0A0A] transition-colors group">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ visitor.ipAddress }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ getCountryFlag(visitor.countryCode) }} {{ visitor.countryCode }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-2">
                        <span class="text-xl">{{ getCountryFlag(visitor.countryCode) }}</span>
                        <span class="text-sm text-gray-900 dark:text-white">{{ visitor.country }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ visitor.city || 'Unknown' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">{{ getBrowserIcon(visitor.browser) }}</span>
                        <span class="text-sm text-gray-900 dark:text-white">{{ visitor.browser }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{{ visitor.os || 'Unknown' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" 
                            [ngClass]="getDeviceBadgeClass(visitor.device)">
                        {{ getDeviceIcon(visitor.device) }}
                        {{ visitor.device }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 text-sm font-semibold text-violet-500">
                        {{ visitor.visitCount }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ visitor.lastVisit | timeAgo }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="lg:hidden space-y-4">
          @for (visitor of visitors(); track visitor.id) {
            <div class="bg-white dark:bg-[#121212] rounded-xl p-4 border border-gray-200 dark:border-[#262626] shadow-sm">
              <!-- Header -->
              <div class="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-[#262626]">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ visitor.ipAddress }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ visitor.lastVisit | timeAgo }}</p>
                </div>
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 text-sm font-semibold text-violet-500">
                  {{ visitor.visitCount }}
                </span>
              </div>

              <!-- Details Grid -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Country</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ getCountryFlag(visitor.countryCode) }} {{ visitor.country }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">City</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ visitor.city || 'Unknown' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Browser</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ getBrowserIcon(visitor.browser) }} {{ visitor.browser }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">OS</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ visitor.os || 'Unknown' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Device</p>
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" 
                        [ngClass]="getDeviceBadgeClass(visitor.device)">
                    {{ getDeviceIcon(visitor.device) }}
                    {{ visitor.device }}
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-20">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-pink-500/10 flex items-center justify-center">
            <svg class="w-10 h-10 text-purple-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No visitors yet</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Start tracking visitors by adding the script to your website</p>
        </div>
      }
    </div>
  `
})
export class VisitorsComponent implements OnInit {
  visitors = signal<any[]>([]);
  loading = signal(false);

  constructor(
    private analyticsService: AnalyticsService,
    private apiKeysService: ApiKeysService
  ) {}

  ngOnInit() {
    const apiKey = this.apiKeysService.selectedApiKey();
    if (apiKey) {
      this.loading.set(true);
      this.analyticsService.getVisitors(apiKey.id).subscribe({
        next: (res) => {
          this.visitors.set(res.data.data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  getCountryFlag(countryCode: string): string {
    if (!countryCode || countryCode === 'LOCAL') return '🌐';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  getBrowserIcon(browser: string): string {
    const browserLower = browser?.toLowerCase() || '';
    if (browserLower.includes('chrome')) return '🌐';
    if (browserLower.includes('firefox')) return '🦊';
    if (browserLower.includes('safari')) return '🧭';
    if (browserLower.includes('edge')) return '🔷';
    if (browserLower.includes('opera')) return '🔴';
    return '🌍';
  }

  getDeviceIcon(device: string): string {
    const deviceLower = device?.toLowerCase() || '';
    if (deviceLower.includes('mobile')) return '📱';
    if (deviceLower.includes('tablet')) return '📱';
    if (deviceLower.includes('desktop')) return '💻';
    return '🖥️';
  }

  getDeviceBadgeClass(device: string): string {
    const deviceLower = device?.toLowerCase() || '';
    if (deviceLower.includes('mobile')) return 'bg-violet-500/10 text-violet-500 border border-violet-500/20';
    if (deviceLower.includes('tablet')) return 'bg-pink-500/10 text-pink-500 border border-pink-500/20';
    if (deviceLower.includes('desktop')) return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
    return 'bg-gray-500/10 text-gray-500 border border-gray-500/20';
  }
}