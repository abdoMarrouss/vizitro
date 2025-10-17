import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiKeysService } from '../../core/services/api-keys.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-api-keys',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 md:p-6 space-y-4 md:space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 class="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">API Keys</h1>
          <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your website tracking keys</p>
        </div>
        <button 
          (click)="showCreateForm = true"
          class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 text-sm font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create API Key
        </button>
      </div>

      <!-- Create Form Modal -->
      @if (showCreateForm) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="showCreateForm = false">
          <div class="bg-white dark:bg-[#121212] rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-[#262626] overflow-hidden" (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="relative p-6 border-b border-gray-200 dark:border-[#262626]">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-violet-500/5 to-pink-500/5"></div>
              <div class="relative z-10">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create New API Key</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a website to start tracking</p>
              </div>
              <button 
                (click)="showCreateForm = false"
                class="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors"
              >
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <form (ngSubmit)="createApiKey()" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="newApiKey.name"
                  name="name"
                  placeholder="My Awesome Website"
                  class="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
                <input 
                  type="url" 
                  [(ngModel)]="newApiKey.websiteUrl"
                  name="websiteUrl"
                  placeholder="https://example.com"
                  class="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  required
                />
              </div>

              <div class="flex gap-3 pt-2">
                <button 
                  type="button"
                  (click)="showCreateForm = false"
                  class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-[#262626] text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-[#333] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  [disabled]="loading()"
                  class="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  @if (loading()) {
                    <span class="flex items-center justify-center gap-2">
                      <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Creating...
                    </span>
                  } @else {
                    Create API Key
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- API Keys List -->
      @if (apiKeys().length > 0) {
        <div class="grid grid-cols-1 gap-4">
          @for (key of apiKeys(); track key.id) {
            <div class="group bg-white dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-[#262626] hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-purple-500/10">
              <!-- Card Header -->
              <div class="p-4 md:p-5 border-b border-gray-200 dark:border-[#262626]">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h3 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate">{{ key.name }}</h3>
                        <a [href]="key.websiteUrl" target="_blank" class="text-xs md:text-sm text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 truncate block">
                          {{ key.websiteUrl }}
                        </a>
                      </div>
                    </div>
                  </div>
                  <button 
                    (click)="deleteApiKey(key.id)"
                    class="self-start sm:self-auto px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>

              <!-- API Key Display -->
              <div class="p-4 md:p-5 space-y-4">
                <!-- API Key -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">API Key</label>
                  <div class="flex gap-2">
                    <div class="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#262626] rounded-lg font-mono text-sm text-gray-900 dark:text-white overflow-x-auto">
                      {{ key.key }}
                    </div>
                    <button 
                      (click)="copyToClipboard(key.key, 'key-' + key.id)"
                      class="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2"
                    >
                      @if (copiedKey === 'key-' + key.id) {
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="hidden sm:inline">Copied!</span>
                      } @else {
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span class="hidden sm:inline">Copy</span>
                      }
                    </button>
                  </div>
                </div>

                <!-- Tracking Script -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Tracking Script</label>
                  <div class="relative">
                    <pre class="p-4 bg-gray-900 dark:bg-black border border-gray-700 dark:border-[#262626] rounded-lg overflow-x-auto text-xs md:text-sm"><code class="text-gray-100">{{ getTrackingScript(key.key) }}</code></pre>
                    <button 
                      (click)="copyToClipboard(getTrackingScript(key.key), 'script-' + key.id)"
                      class="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-1.5 text-xs"
                    >
                      @if (copiedKey === 'script-' + key.id) {
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      } @else {
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      }
                    </button>
                  </div>
                  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Add this script to your website's &lt;head&gt; section to start tracking
                  </p>
                </div>

                <!-- Stats Preview -->
                <div class="pt-3 border-t border-gray-200 dark:border-[#262626]">
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div class="text-center p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Created</p>
                      <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1">{{ formatDate(key.createdAt) }}</p>
                    </div>
                    <div class="text-center p-3 bg-violet-500/5 rounded-lg border border-violet-500/10">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Status</p>
                      <p class="text-sm font-semibold text-violet-500 mt-1">Active</p>
                    </div>
                    <div class="text-center p-3 bg-pink-500/5 rounded-lg border border-pink-500/10">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Type</p>
                      <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1">Analytics</p>
                    </div>
                    <div class="text-center p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Version</p>
                      <p class="text-sm font-semibold text-gray-900 dark:text-white mt-1">v1.0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Empty State -->
        <div class="text-center py-16">
          <div class="max-w-md mx-auto px-4">
            <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-violet-500/10 to-pink-500/10 flex items-center justify-center">
              <svg class="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">No API Keys Yet</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Create your first API key to start tracking your website</p>
            <button 
              (click)="showCreateForm = true"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Your First API Key
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class ApiKeysComponent implements OnInit {
  apiKeys = this.apiKeysService.apiKeys;
  loading = signal(false);
  showCreateForm = false;
  copiedKey = '';
  newApiKey = {
    name: '',
    websiteUrl: ''
  };
  private trackerJsUrl = environment.trackerJsUrl;

  constructor(private apiKeysService: ApiKeysService) {
    
  }

  ngOnInit() {
    this.apiKeysService.loadApiKeys().subscribe();
  }

  createApiKey() {
    if (!this.newApiKey.name || !this.newApiKey.websiteUrl) return;

    this.loading.set(true);
    this.apiKeysService.createApiKey(this.newApiKey).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.newApiKey = { name: '', websiteUrl: '' };
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  deleteApiKey(id: string) {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      this.apiKeysService.deleteApiKey(id).subscribe();
    }
  }

  getTrackingScript(apiKey: string): string {
    return `<script defer src="${this.trackerJsUrl}" data-api-key="${apiKey}"></script>`;
  }

  copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedKey = key;
      setTimeout(() => this.copiedKey = '', 2000);
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }
}