import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiKeysService } from '../../core/services/api-keys.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex" [class.dark]="isDarkMode()">
      <!-- Mobile Menu Button -->
      <button 
        (click)="toggleMobileMenu()"
        class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#262626] rounded-lg shadow-lg"
      >
        <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Sidebar -->
      <aside 
        class="fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-[#262626] transform transition-transform duration-300 lg:translate-x-0"
        [class.-translate-x-full]="!isMobileMenuOpen() && mobileBreakpoint()"
      >
        <!-- Glow effect -->
        <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-500/5 via-violet-500/5 to-transparent pointer-events-none"></div>
        
        <div class="relative z-10 h-full flex flex-col">
         <!-- Logo -->
        <div class="p-6 border-b border-gray-200 dark:border-[#262626]">
        <a routerLink="/" class="flex items-center gap-3 group cursor-pointer">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/30">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">Vizitro</span>
        </a>
        </div>

          <!-- Navigation -->
          <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
            <a 
              routerLink="/dashboard/overview" 
              routerLinkActive="!bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-pink-500/10 border-l-4 !border-purple-500 !text-purple-500"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-all duration-200 text-gray-700 dark:text-gray-300 border-l-4 border-transparent"
              (click)="closeMobileMenu()"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span class="font-medium">Overview</span>
            </a>
            
            <a 
              routerLink="/dashboard/api-keys" 
              routerLinkActive="!bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-pink-500/10 border-l-4 !border-violet-500 !text-violet-500"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-all duration-200 text-gray-700 dark:text-gray-300 border-l-4 border-transparent"
              (click)="closeMobileMenu()"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span class="font-medium">API Keys</span>
            </a>
            
            <a 
              routerLink="/dashboard/visitors" 
              routerLinkActive="!bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-pink-500/10 border-l-4 !border-pink-500 !text-pink-500"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-all duration-200 text-gray-700 dark:text-gray-300 border-l-4 border-transparent"
              (click)="closeMobileMenu()"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="font-medium">Visitors</span>
            </a>
            
            <a 
              routerLink="/dashboard/settings" 
              routerLinkActive="!bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-pink-500/10 border-l-4 !border-purple-500 !text-purple-500"
              class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-all duration-200 text-gray-700 dark:text-gray-300 border-l-4 border-transparent"
              (click)="closeMobileMenu()"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="font-medium">Settings</span>
            </a>
          </nav>

          <!-- User Section -->
          <div class="p-4 border-t border-gray-200 dark:border-[#262626] bg-white/50 dark:bg-[#0A0A0A]/50 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/30">
                  {{ user()?.name?.charAt(0)?.toUpperCase() || user()?.email?.charAt(0)?.toUpperCase() || 'U' }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{{ user()?.name || 'User' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user()?.email }}</p>
                </div>
              </div>
              <button 
                (click)="logout()"
                class="p-2 hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors flex-shrink-0"
                title="Logout"
              >
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Mobile Overlay -->
      @if (isMobileMenuOpen() && mobileBreakpoint()) {
        <div 
          class="fixed inset-0 bg-black/50 z-30 lg:hidden"
          (click)="closeMobileMenu()"
        ></div>
      }

      <!-- Main Content -->
      <div class="flex-1 flex flex-col bg-gray-50 dark:bg-[#0A0A0A] min-w-0">
        <!-- Topbar -->
        <header class="h-16 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-[#262626] flex items-center justify-between px-4 md:px-6 backdrop-blur-sm sticky top-0 z-20">
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <!-- Spacer for mobile menu button -->
            <div class="w-10 lg:hidden"></div>
            
            @if (apiKeys().length > 0) {
              <div class="relative flex-1 max-w-xs">
                <select 
                  (change)="onApiKeyChange($event)"
                  class="w-full pl-4 pr-10 py-2 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 hover:border-purple-500/50 text-sm md:text-base"
                >
                  @for (key of apiKeys(); track key.id) {
                    <option [value]="key.id" [selected]="key.id === selectedApiKey()?.id">
                      {{ key.name }}
                    </option>
                  }
                </select>
                <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            } @else {
              <a routerLink="/dashboard/api-keys" class="px-3 md:px-4 py-2 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 text-sm font-medium">
                Create API Key
              </a>
            }
          </div>

          <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
            <button 
              (click)="toggleTheme()"
              class="p-2 hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-all duration-200 group relative"
              title="Toggle theme"
            >
              @if (isDarkMode()) {
                <svg class="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
                </svg>
              } @else {
                <svg class="w-5 h-5 text-purple-500 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              }
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user = this.authService.currentUser;
  apiKeys = this.apiKeysService.apiKeys;
  selectedApiKey = this.apiKeysService.selectedApiKey;
  isDarkMode = signal(true);
  isMobileMenuOpen = signal(false);
  mobileBreakpoint = signal(false);

  constructor(
    private authService: AuthService,
    private apiKeysService: ApiKeysService
  ) {
    // Initialize dark mode immediately
    effect(() => {
      const darkMode = this.isDarkMode();
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    // Check for mobile breakpoint
    if (typeof window !== 'undefined') {
      this.checkMobileBreakpoint();
      window.addEventListener('resize', () => this.checkMobileBreakpoint());
    }
  }

  ngOnInit() {
    // Load theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('vizitro-theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Default to dark mode
      this.isDarkMode.set(true);
      localStorage.setItem('vizitro-theme', 'dark');
    }

    this.apiKeysService.loadApiKeys().subscribe();
  }

  checkMobileBreakpoint() {
    this.mobileBreakpoint.set(window.innerWidth < 1024);
    if (!this.mobileBreakpoint()) {
      this.isMobileMenuOpen.set(false);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    if (this.mobileBreakpoint()) {
      this.isMobileMenuOpen.set(false);
    }
  }

  onApiKeyChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const key = this.apiKeys().find(k => k.id === select.value);
    if (key) {
      this.apiKeysService.selectApiKey(key);
      window.location.reload();
    }
  }

  toggleTheme() {
    const newTheme = this.isDarkMode() ? 'light' : 'dark';
    this.isDarkMode.set(!this.isDarkMode());
    localStorage.setItem('vizitro-theme', newTheme);
  }

  logout() {
    this.authService.logout();
  }
}