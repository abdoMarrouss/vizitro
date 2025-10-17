import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

// SSR Polyfills - Must run before anything else
if (typeof localStorage === 'undefined') {
  (global as any).localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0
  };
}

if (typeof sessionStorage === 'undefined') {
  (global as any).sessionStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0
  };
}

if (typeof document === 'undefined') {
  (global as any).document = {
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    getElementsByClassName: () => [],
    getElementsByTagName: () => [],
    createElement: () => ({
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      }
    }),
    body: {
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      }
    },
    documentElement: {
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      }
    }
  };
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);