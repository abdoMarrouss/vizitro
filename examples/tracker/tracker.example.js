/**
 * Vizitro Analytics Tracker
 * Lightweight visitor tracking script (~2KB minified)
 * Framework agnostic - works with any website
 */
(function() {
  'use strict';

  // ============================================
  // Configuration
  // ============================================
  const script = document.currentScript;
  const apiKey = script.getAttribute('data-api-key');
  const apiUrl = script.getAttribute('data-api-url') || 'https://api.vizitro.com';
  const trackPageViews = script.getAttribute('data-track-pageviews') !== 'false';
  
  // Validation
  if (!apiKey) {
    console.error('[Vizitro] Error: data-api-key attribute is required');
    return;
  }

  // State
  let hasTracked = false;
  let sessionId = getOrCreateSessionId();

  // ============================================
  // Session Management
  // ============================================
  function getOrCreateSessionId() {
    const storageKey = 'vizitro_session_id';
    let sessionId = sessionStorage.getItem(storageKey);
    
    if (!sessionId) {
      sessionId = generateId();
      sessionStorage.setItem(storageKey, sessionId);
    }
    
    return sessionId;
  }

  function generateId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // ============================================
  // Data Collection
  // ============================================
  function getPageData() {
    return {
      apiKey: apiKey,
      url: window.location.href,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language || navigator.userLanguage,
      sessionId: sessionId,
    };
  }

  // ============================================
  // Tracking
  // ============================================
  function track() {
    if (hasTracked) return;

    hasTracked = true;
    const data = getPageData();

    // Send via fetch API
    fetch(`${apiUrl}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      keepalive: true, // Ensures request completes even if user leaves page
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      if (window.vizitroDebug) {
        console.log('[Vizitro] Tracking successful:', result);
      }
    })
    .catch(error => {
      if (window.vizitroDebug) {
        console.error('[Vizitro] Tracking failed:', error);
      }
    });
  }

  // ============================================
  // Page View Tracking
  // ============================================
  function trackPageView() {
    if (!trackPageViews) return;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', track);
    } else {
      track();
    }
  }

  // ============================================
  // SPA Support - Track URL changes
  // ============================================
  function setupSpaTracking() {
    let lastPath = window.location.pathname;

    // Monitor URL changes for SPAs
    setInterval(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPath) {
        lastPath = currentPath;
        hasTracked = false; // Reset for new page
        track();
      }
    }, 500);

    // Listen to popstate (back/forward buttons)
    window.addEventListener('popstate', () => {
      hasTracked = false;
      track();
    });

    // Listen to History API pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
      originalPushState.apply(this, arguments);
      hasTracked = false;
      setTimeout(track, 100);
    };

    history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      hasTracked = false;
      setTimeout(track, 100);
    };
  }

  // ============================================
  // Public API
  // ============================================
  window.vizitro = {
    track: function() {
      hasTracked = false;
      track();
    },
    version: '1.0.0',
  };

  // ============================================
  // Initialize
  // ============================================
  trackPageView();
  setupSpaTracking();

})();