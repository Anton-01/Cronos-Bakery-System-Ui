import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * HTTP Interceptor to handle errors and refresh tokens
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - Try to refresh token
      if (error.status === 401 && !req.url.includes('/auth/')) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry the original request with new token
            const token = authService.getAccessToken();
            const clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            });
            return next(clonedRequest);
          }),
          catchError((refreshError) => {
            // Refresh failed, logout user
            authService.logout();
            notificationService.error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
            return throwError(() => refreshError);
          })
        );
      }

      // Handle 403 Forbidden
      if (error.status === 403) {
        notificationService.error('No tiene permisos para realizar esta acción.');
      }

      // Handle 404 Not Found
      if (error.status === 404) {
        notificationService.error('Recurso no encontrado.');
      }

      // Handle 409 Conflict
      if (error.status === 409) {
        notificationService.error(error.error?.message || 'Ya existe un recurso con esos datos.');
      }

      // Handle 500 Internal Server Error
      if (error.status === 500) {
        notificationService.error('Error interno del servidor. Por favor, intente nuevamente.');
      }

      // Handle validation errors (400)
      if (error.status === 400 && error.error?.errors) {
        const validationErrors = error.error.errors;
        validationErrors.forEach((err: { field: string; message: string }) => {
          notificationService.error(err.message, err.field);
        });
      }

      return throwError(() => error);
    })
  );
};
