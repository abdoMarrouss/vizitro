import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 md:p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent mb-2">Settings</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
      </div>

      <div class="max-w-4xl space-y-6">
        <!-- Profile Section -->
        <div class="bg-white dark:bg-[#121212] rounded-xl p-6 border border-gray-200 dark:border-[#262626] shadow-sm">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Your personal details</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div class="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#262626] rounded-lg">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span class="text-gray-900 dark:text-white">{{ user()?.email }}</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <div class="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#262626] rounded-lg">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="text-gray-900 dark:text-white">{{ user()?.name || 'Not set' }}</span>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User ID</label>
              <div class="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#262626] rounded-lg">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                <span class="text-sm font-mono text-gray-600 dark:text-gray-400">{{ user()?.id }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="bg-white dark:bg-[#121212] rounded-xl p-6 border border-gray-200 dark:border-[#262626] shadow-sm">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/10 to-red-500/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Account Actions</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">Manage your session</p>
            </div>
          </div>

          <button 
            (click)="logout()"
            class="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5 transition-all duration-300 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  user = this.authService.currentUser;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}