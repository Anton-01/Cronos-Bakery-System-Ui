import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

import { routes } from './app.routes';
import { authInterceptorFn } from './core/interceptors/auth.interceptor'; // Función - agrega token
import { errorInterceptor } from './core/interceptors/error.interceptor'; // Función - maneja errores
import { loadingInterceptor } from './core/interceptors/loading.interceptor'; // Función - spinner

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // HTTP Client con interceptores funcionales en orden correcto:
    // 1. authInterceptorFn - Agrega el Bearer token a las peticiones
    // 2. errorInterceptor - Maneja errores HTTP y refresh de tokens
    // 3. loadingInterceptor - Muestra/oculta el spinner de carga
    provideHttpClient(
      withInterceptors([
        authInterceptorFn,
        errorInterceptor,
        loadingInterceptor,
      ])
    ),

    provideAnimationsAsync(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
      })
    ),
  ],
};
