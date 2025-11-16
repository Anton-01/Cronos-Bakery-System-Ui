import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor'; // Es una CLASE
import { errorInterceptor } from './core/interceptors/error.interceptor'; // Es una FUNCIÓN
import { loadingInterceptor } from './core/interceptors/loading.interceptor'; // Es una FUNCIÓN

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideHttpClient(withInterceptors([ errorInterceptor, loadingInterceptor,])),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, },

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
