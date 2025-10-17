import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CopyButtonComponent } from '../shared/components/copy-button.component';
import { AuthService } from '../core/services/auth.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-documentation',
    standalone: true,
    imports: [CommonModule, RouterLink, CopyButtonComponent],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-[#0A0A0A]" [class.dark]="isDarkMode()">
      <!-- Animated Background -->
      <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
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

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Page Title -->
        <div class="mb-12">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">Documentation</span>
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">Everything you need to get started with Vizitro</p>
        </div>

        <!-- Quick Start -->
        <section class="mb-12">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Quick Start</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Get started with Vizitro in 3 simple steps:</p>
          
          <div class="space-y-4">
            <div class="group bg-white dark:bg-[#121212] rounded-xl p-6 border border-gray-200 dark:border-[#262626] hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                <div class="flex-1">
                  <h3 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Create an account</h3>
                  <p class="text-gray-600 dark:text-gray-400">Sign up for free at <a routerLink="/register" class="text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 underline">vizitro.com/register</a></p>
                </div>
              </div>
            </div>

            <div class="group bg-white dark:bg-[#121212] rounded-xl p-6 border border-gray-200 dark:border-[#262626] hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                <div class="flex-1">
                  <h3 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Generate an API key</h3>
                  <p class="text-gray-600 dark:text-gray-400">Go to your dashboard and create a new API key for your website</p>
                </div>
              </div>
            </div>

            <div class="group bg-white dark:bg-[#121212] rounded-xl p-6 border border-gray-200 dark:border-[#262626] hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                <div class="flex-1">
                  <h3 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Add the tracking script</h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-3">Copy and paste this snippet into your website's &lt;head&gt; tag:</p>
                  <div class="bg-gray-900 dark:bg-black rounded-lg p-4 relative">
                    <pre class="text-sm overflow-x-auto text-gray-100"><code>&lt;script 
  src="{{ trackerUrl }}" 
  data-api-key="your-api-key-here"
  defer&gt;
&lt;/script&gt;</code></pre>
                    <div class="absolute top-2 right-2">
                      <app-copy-button [text]="scriptSnippet" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Frameworks -->
        <section class="mb-12">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Framework Guides</h2>
          
          <div class="space-y-6">
            <!-- React -->
            <div class="bg-white dark:bg-[#121212] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-lg bg-[#61DAFB]/10 flex items-center justify-center">
                  <span class="text-2xl">⚛️</span>
                </div>
                <h3 class="font-semibold text-lg text-gray-900 dark:text-white">React</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-3">Add to your <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-purple-500">public/index.html</code>:</p>
              <div class="bg-gray-900 dark:bg-black rounded-lg p-4">
                <pre class="text-sm overflow-x-auto text-gray-100"><code>&lt;script 
  src="{{ trackerUrl }}" 
  data-api-key="your-api-key-here"
  defer&gt;
&lt;/script&gt;</code></pre>
              </div>
            </div>

            <!-- Vue -->
            <div class="bg-white dark:bg-[#121212] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-lg bg-[#42b883]/10 flex items-center justify-center">
                  <span class="text-2xl">💚</span>
                </div>
                <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Vue</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-3">Add to your <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-purple-500">public/index.html</code>:</p>
              <div class="bg-gray-900 dark:bg-black rounded-lg p-4">
                <pre class="text-sm overflow-x-auto text-gray-100"><code>&lt;script 
  src="{{ trackerUrl }}" 
  data-api-key="your-api-key-here"
  defer&gt;
&lt;/script&gt;</code></pre>
              </div>
            </div>

            <!-- Angular -->
            <div class="bg-white dark:bg-[#121212] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-lg bg-[#DD0031]/10 flex items-center justify-center">
                  <span class="text-2xl">🅰️</span>
                </div>
                <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Angular</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-3">Add to your <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-purple-500">src/index.html</code>:</p>
              <div class="bg-gray-900 dark:bg-black rounded-lg p-4">
                <pre class="text-sm overflow-x-auto text-gray-100"><code>&lt;script 
  src="{{ trackerUrl }}" 
  data-api-key="your-api-key-here"
  defer&gt;
&lt;/script&gt;</code></pre>
              </div>
            </div>

            <!-- WordPress -->
            <div class="bg-white dark:bg-[#121212] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-lg bg-[#21759B]/10 flex items-center justify-center">
                  <span class="text-2xl">📝</span>
                </div>
                <h3 class="font-semibold text-lg text-gray-900 dark:text-white">WordPress</h3>
              </div>
              <p class="text-gray-600 dark:text-gray-400">Add to your theme's <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-purple-500">header.php</code> or use a plugin like "Insert Headers and Footers"</p>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="mb-12">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Features</h2>
          <div class="bg-white dark:bg-[#121212] rounded-xl p-6 border border-gray-200 dark:border-[#262626]">
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-gray-700 dark:text-gray-300">Automatic page view tracking</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-gray-700 dark:text-gray-300">SPA (Single Page Application) support</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-gray-700 dark:text-gray-300">No cookies, privacy-friendly</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-gray-700 dark:text-gray-300">Lightweight (< 1KB)</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-gray-700 dark:text-gray-300">Real-time analytics</span>
              </li>
            </ul>
          </div>
        </section>

       <!-- Support -->
<section>
  <div class="bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500 rounded-2xl p-8 text-center text-white">
    <h2 class="text-2xl font-bold mb-2">Need Help?</h2>
    <p class="mb-6 opacity-90">I'm here to assist you</p>
    <a href="mailto:marrouss.abdelilah{{ '@' }}gmail.com" class="text-xl font-semibold hover:underline">
      marrouss.abdelilah{{ '@' }}gmail.com
    </a>
  </div>
</section>
      </div>
    </div>
  `
})
export class DocumentationComponent implements OnInit {
    isDarkMode = signal(true);
    isAuthenticated = signal(false);
    githubRepoUrl = 'https://github.com/yourusername/vizitro';
    trackerUrl = environment.trackerJsUrl;
    isMobileMenuOpen = signal(false);

    scriptSnippet = `<script 
  src="${environment.trackerJsUrl}" 
  data-api-key="your-api-key-here"
  defer>
</script>`;

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