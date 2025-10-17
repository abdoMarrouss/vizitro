import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RegisterRequest } from '../core/models';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] flex items-center justify-center px-4" [class.dark]="isDarkMode()">
      <!-- Animated Background -->
      <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl animate-pulse" style="animation-delay: 0.5s"></div>
        <div class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl animate-pulse" style="animation-delay: 0.7s"></div>
      </div>

      <div class="max-w-md w-full">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500 mb-6 shadow-2xl shadow-purple-500/30 animate-fade-in-down">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold mb-2 animate-fade-in-up">
            <span class="bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">Create Your Account</span>
          </h1>
          <p class="text-gray-600 dark:text-gray-400 animate-fade-in-up" style="animation-delay: 0.1s">Start tracking your website for free</p>
        </div>

        <!-- Register Form -->
        <div class="bg-white dark:bg-[#121212] rounded-2xl p-8 border border-gray-200 dark:border-[#262626] shadow-xl animate-fade-in-up" style="animation-delay: 0.2s">
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <div class="mb-5">
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name (Optional)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  [(ngModel)]="userData.name"
                  class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div class="mb-5">
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  [(ngModel)]="userData.email"
                  required
                  email
                  class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  [(ngModel)]="userData.password"
                  required
                  minlength="6"
                  class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                At least 6 characters
              </p>
            </div>

            @if (error) {
              <div class="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm flex items-center gap-2 animate-shake">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ error }}</span>
              </div>
            }

            @if (success) {
              <div class="mb-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500 text-sm flex items-center gap-2 animate-fade-in-up">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Account created successfully! Redirecting...</span>
              </div>
            }

            <button
              type="submit"
              [disabled]="loading || !registerForm.valid"
              class="w-full px-6 py-3 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              @if (loading) {
                <div class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </div>
              } @else {
                <span>Create Account</span>
              }
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-[#262626]"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-[#121212] text-gray-500 dark:text-gray-400">or</span>
            </div>
          </div>

          <!-- Sign In Link -->
          <p class="text-center text-gray-600 dark:text-gray-400">
            Already have an account?
            <a routerLink="/login" class="text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium ml-1 hover:underline transition-colors">
              Sign in
            </a>
          </p>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-6">
          <a routerLink="/" class="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors inline-flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in-down {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.6s ease-out backwards; }
    .animate-fade-in-down { animation: fade-in-down 0.6s ease-out backwards; }
    .animate-shake { animation: shake 0.3s ease-in-out; }
  `]
})
export class RegisterComponent implements OnInit {
  userData: RegisterRequest = { email: '', password: '', name: '' };
  loading = false;
  error = '';
  success = false;
  isDarkMode = signal(true);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    effect(() => {
      const darkMode = this.isDarkMode();
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  ngOnInit() {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Load theme
    const savedTheme = localStorage.getItem('vizitro-theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      this.isDarkMode.set(true);
      localStorage.setItem('vizitro-theme', 'dark');
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.success = false;

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        // Redirect to dashboard after successful registration
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}