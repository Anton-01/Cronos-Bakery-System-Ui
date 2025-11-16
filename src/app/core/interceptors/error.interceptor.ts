import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ErrorHandler, ErrorType, ValidationError } from '../../shared/utils/error-handler.util';

/**
 * HTTP Interceptor to handle errors globally
 * Uses the robust ErrorHandler utility for consistent error processing
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Process error using ErrorHandler utility
      const errorDetails = ErrorHandler.safeHandle(error, {
        context: `HTTP ${req.method} ${req.url}`,
        logToConsole: true,
      });

      // Determine error type and handle accordingly
      const errorType = ErrorHandler.getErrorType(error);

      switch (errorType) {
        case ErrorType.AUTHENTICATION:
          // Handle 401 Unauthorized - Try to refresh token
          if (!req.url.includes('/auth/')) {
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
          notificationService.error(errorDetails.message);
          break;

        case ErrorType.AUTHORIZATION:
          // Handle 403 Forbidden
          notificationService.error(errorDetails.message);
          break;

        case ErrorType.NOT_FOUND:
          // Handle 404 Not Found
          notificationService.error(errorDetails.message);
          break;

        case ErrorType.CONFLICT:
          // Handle 409 Conflict
          notificationService.error(error.error?.message || errorDetails.message);
          break;

        case ErrorType.VALIDATION:
          // Handle 400 Validation errors
          const validationErrors: ValidationError[] = ErrorHandler.extractValidationErrors(error);
          if (validationErrors.length > 0) {
            validationErrors.forEach((err) => {
              notificationService.error(err.message, err.field);
            });
          } else {
            notificationService.error(errorDetails.message);
          }
          break;

        case ErrorType.SERVER:
          // Handle 500, 502, 503, 504 Server errors
          notificationService.error(errorDetails.message);
          break;

        case ErrorType.NETWORK:
          // Handle network errors
          notificationService.error('No se puede conectar al servidor. Verifique su conexión a internet.');
          break;

        default:
          // Handle unexpected errors
          notificationService.error(errorDetails.message);
          break;
      }

      return throwError(() => error);
    })
  );
};
