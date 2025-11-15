import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

/**
 * HTTP Interceptor to add JWT token to requests and update activity
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);
  const token = authService.getAccessToken();

  // Skip adding token for auth endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // Add authorization header with JWT token
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Update last activity on successful requests
  return next(req).pipe(
    tap(() => {
      if (token && authService.isAuthenticated()) {
        storageService.updateLastActivity();
      }
    })
  );
};
