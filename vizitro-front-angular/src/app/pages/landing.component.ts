import { Component, signal, effect, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-[#0A0A0A]" [class.dark]="isDarkMode()">
      <!-- Animated Background -->
      <div class="fixed inset-0 -z-10 overflow-hidden">
        <div class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl animate-pulse" style="animation-delay: 0.5s"></div>
        <div class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl animate-pulse" style="animation-delay: 0.7s"></div>
      </div>

     <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#121212]/80 border-b border-gray-200 dark:border-[#262626]">
  <div class="container mx-auto px-4">
    <!-- Main header bar -->
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <div class="flex items-center gap-3 group cursor-pointer">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <span class="text-2xl font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">Vizitro</span>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-6">
        <a routerLink="/documentation" class="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200 font-medium">Documentation</a>
        
        <a 
          [href]="githubRepoUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="p-2 hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-all duration-200 group"
          title="View on GitHub"
        >
          <svg class="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>

        @if (isAuthenticated()) {
          <a routerLink="/dashboard" class="px-6 py-2.5 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-200 font-medium">
            Dashboard
          </a>
        } @else {
          <a routerLink="/login" class="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200 font-medium">Login</a>
          <a routerLink="/register" class="px-6 py-2.5 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-200 font-medium">
            Get Started
          </a>
        }

        <button 
          (click)="toggleTheme()"
          class="p-2 hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-all duration-200 group"
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
      </nav>

      <!-- Mobile Menu Buttons -->
      <div class="flex md:hidden items-center gap-2">
        <button 
          (click)="toggleTheme()"
          class="p-2 hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-all duration-200"
        >
          @if (isDarkMode()) {
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
          } @else {
            <svg class="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          }
        </button>

        <button 
          (click)="toggleMobileMenu()"
          class="p-2 hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-all duration-200"
        >
          @if (isMobileMenuOpen()) {
            <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          } @else {
            <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          }
        </button>
      </div>
    </div>

    <!-- Mobile Menu Dropdown - INSIDE container, AFTER main header bar -->
    @if (isMobileMenuOpen()) {
      <div class="md:hidden pb-4 border-t border-gray-200 dark:border-[#262626] mt-0 pt-4">
        <nav class="flex flex-col space-y-1">
          <a 
            routerLink="/documentation" 
            (click)="toggleMobileMenu()" 
            class="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-[#0A0A0A] transition-all duration-200 font-medium px-3 py-2.5 rounded-lg"
          >
            Documentation
          </a>
          
          <a 
            [href]="githubRepoUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-[#0A0A0A] transition-all duration-200 font-medium px-3 py-2.5 rounded-lg"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>

          @if (isAuthenticated()) {
            <a 
              routerLink="/dashboard" 
              (click)="toggleMobileMenu()" 
              class="mt-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium text-center"
            >
              Dashboard
            </a>
          } @else {
            <a 
              routerLink="/login" 
              (click)="toggleMobileMenu()" 
              class="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-[#0A0A0A] transition-all duration-200 font-medium px-3 py-2.5 rounded-lg"
            >
              Login
            </a>
            <a 
              routerLink="/register" 
              (click)="toggleMobileMenu()" 
              class="mt-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium text-center"
            >
              Get Started
            </a>
          }
        </nav>
      </div>
    }
  </div>
</header>

      <!-- Hero Section -->
      <section class="container mx-auto px-4 pt-20 pb-32">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 dark:text-purple-400 text-sm font-medium animate-fade-in-down">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Free & Open Source Analytics
          </div>

          <h1 class="text-6xl md:text-7xl font-bold leading-tight animate-fade-in-up">
            <span class="text-gray-900 dark:text-white">
              Privacy-First
            </span>
            <br/>
            <span class="bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
              Web Analytics
            </span>
          </h1>

          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.1s">
            Track your website visitors with complete privacy. No cookies, no tracking, GDPR compliant. 
            Just simple, beautiful analytics.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up pt-4" style="animation-delay: 0.2s">
            @if (isAuthenticated()) {
              <a routerLink="/dashboard" class="group px-8 py-4 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transform hover:-translate-y-1 transition-all duration-300">
                Go to Dashboard
                <svg class="inline-block ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            } @else {
              <a routerLink="/register" class="group px-8 py-4 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transform hover:-translate-y-1 transition-all duration-300">
                Start Free
                <svg class="inline-block ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            }
            <a routerLink="/documentation" class="px-8 py-4 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white rounded-xl font-semibold hover:border-purple-500/50 transform hover:-translate-y-1 transition-all duration-300">
              View Documentation
            </a>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto animate-fade-in-up" style="animation-delay: 0.3s">
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900 dark:text-white">< 1KB</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Script Size</div>
            </div>
            <div class="text-center border-x border-gray-200 dark:border-[#262626]">
              <div class="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">GDPR Ready</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900 dark:text-white">0ms</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Setup Time</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Live Demo Dashboard -->
      <section class="container mx-auto px-4 pb-20">
        <div class="max-w-6xl mx-auto">
          <div class="bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-[#262626] shadow-2xl overflow-hidden">
            <div class="bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-pink-500/10 border-b border-gray-200 dark:border-[#262626] px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400 ml-4">Live Demo Dashboard</span>
                </div>
                <span class="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">Last 7 days</span>
              </div>
            </div>

            <div class="p-8">
              <!-- Stats Grid -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-6 border border-gray-200 dark:border-[#262626] hover:border-purple-500/50 transition-all duration-300 group">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Unique Visitors</p>
                  <p class="text-3xl font-bold text-gray-900 dark:text-white">24.8k</p>
                  <p class="text-sm text-green-500 mt-2">↑ 12% vs last week</p>
                </div>
                <div class="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-6 border border-gray-200 dark:border-[#262626] hover:border-violet-500/50 transition-all duration-300">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Visits</p>
                  <p class="text-3xl font-bold text-gray-900 dark:text-white">48.2k</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">→ 0% change</p>
                </div>
                <div class="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-6 border border-gray-200 dark:border-[#262626] hover:border-pink-500/50 transition-all duration-300">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Page Views</p>
                  <p class="text-3xl font-bold text-gray-900 dark:text-white">156k</p>
                  <p class="text-sm text-green-500 mt-2">↑ 5% increase</p>
                </div>
                <div class="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-6 border border-gray-200 dark:border-[#262626] hover:border-purple-500/50 transition-all duration-300">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Bounce Rate</p>
                  <p class="text-3xl font-bold text-gray-900 dark:text-white">38%</p>
                  <p class="text-sm text-green-500 mt-2">↓ 3% better</p>
                </div>
              </div>

              <!-- Chart Area -->
              <div class="bg-white dark:bg-[#121212] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-[#262626] mb-8">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">Visitor Trends</h3>
                  <div class="flex items-center gap-2 text-xs">
                    <span class="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 animate-pulse"></span>
                    <span class="text-gray-500 dark:text-gray-400">Live</span>
                  </div>
                </div>
                
                <!-- SVG Area Chart -->
                <svg viewBox="0 0 700 280" class="w-full h-56 md:h-64">
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:rgb(168, 85, 247);stop-opacity:0.7" />
                      <stop offset="50%" style="stop-color:rgb(139, 92, 246);stop-opacity:0.5" />
                      <stop offset="100%" style="stop-color:rgb(236, 72, 153);stop-opacity:0.2" />
                    </linearGradient>
                  </defs>
                  
                  <!-- Grid lines -->
                  <line x1="0" y1="60" x2="700" y2="60" stroke="currentColor" stroke-width="1" class="text-gray-200 dark:text-gray-800" stroke-dasharray="4,4"/>
                  <line x1="0" y1="120" x2="700" y2="120" stroke="currentColor" stroke-width="1" class="text-gray-200 dark:text-gray-800" stroke-dasharray="4,4"/>
                  <line x1="0" y1="180" x2="700" y2="180" stroke="currentColor" stroke-width="1" class="text-gray-200 dark:text-gray-800" stroke-dasharray="4,4"/>
                  <line x1="0" y1="240" x2="700" y2="240" stroke="currentColor" stroke-width="1" class="text-gray-200 dark:text-gray-800" stroke-dasharray="4,4"/>
                  
                  <!-- Area fill -->
                  <path d="M 0 140 C 50 110, 100 80, 100 80 L 200 120 L 300 60 L 400 100 L 500 40 L 600 70 L 700 90 L 700 250 L 0 250 Z" 
                        fill="url(#areaGradient)" 
                        class="hover:opacity-90 transition-opacity"/>
                  
                  <!-- Line -->
                  <path d="M 0 140 C 50 110, 100 80, 100 80 L 200 120 L 300 60 L 400 100 L 500 40 L 600 70 L 700 90" 
                        fill="none" 
                        stroke="rgb(168, 85, 247)" 
                        stroke-width="3" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"/>
                  
                  <!-- Data points -->
                  <circle cx="100" cy="80" r="5" fill="rgb(168, 85, 247)" class="hover:r-7 transition-all cursor-pointer"/>
                  <circle cx="200" cy="120" r="5" fill="rgb(168, 85, 247)" class="hover:r-7 transition-all cursor-pointer"/>
                  <circle cx="300" cy="60" r="5" fill="rgb(168, 85, 247)" class="hover:r-7 transition-all cursor-pointer"/>
                  <circle cx="400" cy="100" r="5" fill="rgb(168, 85, 247)" class="hover:r-7 transition-all cursor-pointer"/>
                  <circle cx="500" cy="40" r="5" fill="rgb(168, 85, 247)" class="hover:r-7 transition-all cursor-pointer"/>
                  <circle cx="600" cy="70" r="5" fill="rgb(168, 85, 247)" class="hover:r-7 transition-all cursor-pointer"/>
                  <circle cx="700" cy="90" r="5" fill="rgb(168, 85, 247)" class="hover:r-7 transition-all cursor-pointer"/>
                </svg>
                
                <div class="flex justify-between mt-3 text-xs text-gray-500 dark:text-gray-400 px-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <!-- Top Pages & Sources -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
                  <h3 class="font-semibold mb-4 text-gray-900 dark:text-white">Top Pages</h3>
                  <div class="space-y-3">
                    <div class="group">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">/dashboard</span>
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">18.2k</span>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 rounded-full transition-all duration-500" style="width: 85%"></div>
                      </div>
                    </div>
                    <div class="group">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">/analytics</span>
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">12.8k</span>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500" style="width: 60%"></div>
                      </div>
                    </div>
                    <div class="group">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">/home</span>
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">6.4k</span>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full transition-all duration-500" style="width: 35%"></div>
                      </div>
                    </div>
                  </div>
                </div>


<!-- Top Sources - Replace the existing section -->
<div class="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
  <h3 class="font-semibold mb-4 text-gray-900 dark:text-white">Top Sources</h3>
  <div class="space-y-3">
    <!-- Direct -->
    <div class="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors cursor-pointer group">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gray-500/10 flex items-center justify-center">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <span class="text-sm text-gray-900 dark:text-white group-hover:text-violet-500 transition-colors">Direct / None</span>
      </div>
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">15.6k</span>
    </div>

    <!-- Google -->
    <div class="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors cursor-pointer group">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center border border-gray-200 dark:border-gray-700">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
        <span class="text-sm text-gray-900 dark:text-white group-hover:text-violet-500 transition-colors">Google</span>
      </div>
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">6.2k</span>
    </div>

    <!-- Facebook -->
    <div class="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors cursor-pointer group">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-[#1877F2]/10 flex items-center justify-center">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
        <span class="text-sm text-gray-900 dark:text-white group-hover:text-violet-500 transition-colors">Facebook</span>
      </div>
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">4.1k</span>
    </div>

    <!-- Twitter/X -->
    <div class="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors cursor-pointer group">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
          <svg class="w-4 h-4 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>
        <span class="text-sm text-gray-900 dark:text-white group-hover:text-violet-500 transition-colors">X (Twitter)</span>
      </div>
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">2.8k</span>
    </div>

    <!-- GitHub -->
    <div class="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors cursor-pointer group">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-white dark:text-gray-900" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
        <span class="text-sm text-gray-900 dark:text-white group-hover:text-violet-500 transition-colors">GitHub</span>
      </div>
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">1.9k</span>
    </div>
  </div>
</div>
              </div>

              <!-- Top Countries & Devices -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
                  <h3 class="font-semibold mb-4 text-gray-900 dark:text-white">Top Countries</h3>
                  <div class="space-y-3">
                    <div class="group">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">United States</span>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-gray-900 dark:text-white">8.2k</span>
                          <span class="text-xs text-gray-500 dark:text-gray-400">33%</span>
                        </div>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500" style="width: 33%"></div>
                      </div>
                    </div>
                    <div class="group">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">United Kingdom</span>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-gray-900 dark:text-white">5.9k</span>
                          <span class="text-xs text-gray-500 dark:text-gray-400">24%</span>
                        </div>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500" style="width: 24%"></div>
                      </div>
                    </div>
                    <div class="group">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">Germany</span>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-gray-900 dark:text-white">4.1k</span>
                          <span class="text-xs text-gray-500 dark:text-gray-400">17%</span>
                        </div>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500" style="width: 17%"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-[#0A0A0A] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
                  <h3 class="font-semibold mb-4 text-gray-900 dark:text-white">Top Devices</h3>
                  <div class="space-y-3">
                    <div class="group">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-900 dark:text-white group-hover:text-violet-500 transition-colors">Desktop</span>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-gray-900 dark:text-white">14.6k</span>
                          <span class="text-xs text-gray-500 dark:text-gray-400">59%</span>
                        </div>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500" style="width: 59%"></div>
                      </div>
                    </div>
                    <div class="group">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-900 dark:text-white group-hover:text-violet-500 transition-colors">Mobile</span>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-gray-900 dark:text-white">7.4k</span>
                          <span class="text-xs text-gray-500 dark:text-gray-400">30%</span>
                        </div>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500" style="width: 30%"></div>
                      </div>
                    </div>
                    <div class="group">
                      <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-900 dark:text-white group-hover:text-violet-500 transition-colors">Tablet</span>
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-medium text-gray-900 dark:text-white">2.8k</span>
                          <span class="text-xs text-gray-500 dark:text-gray-400">11%</span>
                        </div>
                      </div>
                      <div class="h-2 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500" style="width: 11%"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="container mx-auto px-4 py-20">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Why Choose Vizitro?</h2>
            <p class="text-xl text-gray-600 dark:text-gray-400">Everything you need for privacy-focused analytics</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="group p-8 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#262626] hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 animate-fade-in-up" style="animation-delay: 0s">
              <div class="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Privacy First</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">No cookies, no personal data collection. GDPR compliant out of the box.</p>
            </div>
            
            <div class="group p-8 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#262626] hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 animate-fade-in-up" style="animation-delay: 0.1s">
              <div class="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Lightning Fast</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Less than 1KB script size. Your site speed stays pristine.</p>
            </div>
            
            <div class="group p-8 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#262626] hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 animate-fade-in-up" style="animation-delay: 0.2s">
              <div class="w-16 h-16 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Developer Friendly</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">Simple setup. Works with any framework. One script tag and done.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="container mx-auto px-4 py-20">
        <div class="max-w-4xl mx-auto">
          <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500 p-12 text-center shadow-2xl">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
            <div class="relative z-10">
              <h2 class="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join developers tracking millions of visitors with complete privacy
              </p>
              @if (isAuthenticated()) {
                <a routerLink="/dashboard" class="inline-block px-8 py-4 bg-white text-purple-500 rounded-xl font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  Open Dashboard
                </a>
              } @else {
                <a routerLink="/register" class="inline-block px-8 py-4 bg-white text-purple-500 rounded-xl font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  Create Free Account
                </a>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-gray-200 dark:border-[#262626] bg-white/50 dark:bg-[#121212]/50 backdrop-blur-sm">
        <div class="container mx-auto px-4 py-8">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">Vizitro</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">© 2025 Vizitro. Free Visitors Tracker.</p>
          </div>
        </div>
      </footer>
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
    .animate-fade-in-up { animation: fade-in-up 0.6s ease-out backwards; }
    .animate-fade-in-down { animation: fade-in-down 0.6s ease-out backwards; }
  `]
})
export class LandingComponent implements OnInit {
  isDarkMode = signal(false);
  isAuthenticated = signal(false);
  githubRepoUrl = 'https://github.com/abdoMarrouss/vizitro';
  isMobileMenuOpen = signal(false);
  private platformId = inject(PLATFORM_ID);

  constructor(private authService: AuthService) {
    effect(() => {
      const darkMode = this.isDarkMode();
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

toggleMobileMenu() {
  this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
}

  ngOnInit() {
    const savedTheme = localStorage.getItem('vizitro-theme');
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      this.isDarkMode.set(true);
      localStorage.setItem('vizitro-theme', 'dark');
    }

    this.isAuthenticated.set(this.authService.isAuthenticated());
  }

  toggleTheme() {
    const newTheme = this.isDarkMode() ? 'light' : 'dark';
    this.isDarkMode.set(!this.isDarkMode());
    localStorage.setItem('vizitro-theme', newTheme);
  }
}