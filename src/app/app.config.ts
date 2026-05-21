import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

const GamuTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#faf9e8',
      100: '#f2f0c4',
      200: '#e8e39a',
      300: '#d9d166',
      400: '#c9c466',
      500: '#ada749',
      600: '#8e8a3a',
      700: '#6e6b2c',
      800: '#4e4c1f',
      900: '#2e2d12',
      950: '#1a1a0a',
    },
    colorScheme: {
      dark: {
        surface: {
          0:   '#ffffff',
          50:  '#e8e4c8',
          100: '#c9c4a0',
          200: '#a0a89c',
          300: '#7a8a76',
          400: '#4a6050',
          500: '#283e2a',
          600: '#1d2b1d',
          700: '#162115',
          800: '#0f170e',
          900: '#0a130e',
          950: '#060d09',
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: GamuTheme,
        options: {
          darkModeSelector: 'body',
          cssLayer: false,
        },
      },
    }),
  ],
};
