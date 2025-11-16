import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

/**
 * Error details interface
 */
export interface ErrorDetails {
  message: string;
  status?: number;
  statusText?: string;
  originalError?: unknown;
  timestamp: string;
  context?: string;
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Error handler options
 */
export interface ErrorHandlerOptions {
  context?: string;
  logToConsole?: boolean;
  notifyUser?: boolean;
  customMessage?: string;
}

/**
 * Error type enumeration
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  HTTP = 'HTTP',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Robust error handling utility
 * Provides centralized error processing with detailed logging and user-friendly messages
 */
export class ErrorHandler {
  /**
   * Handle HTTP errors
   */
  static handleHttpError(
    error: HttpErrorResponse,
    options: ErrorHandlerOptions = {}
  ): Observable<never> {
    const errorDetails = this.processHttpError(error, options);

    if (options.logToConsole !== false) {
      this.logError(errorDetails);
    }

    return throwError(() => errorDetails);
  }

  /**
   * Handle generic errors
   */
  static handleError(
    error: unknown,
    options: ErrorHandlerOptions = {}
  ): Observable<never> {
    const errorDetails = this.processGenericError(error, options);

    if (options.logToConsole !== false) {
      this.logError(errorDetails);
    }

    return throwError(() => errorDetails);
  }

  /**
   * Process HTTP error and extract details
   */
  private static processHttpError(
    error: HttpErrorResponse,
    options: ErrorHandlerOptions
  ): ErrorDetails {
    const { context, customMessage } = options;
    const timestamp = new Date().toISOString();

    const errorDetails: ErrorDetails = {
      message: customMessage || this.getHttpErrorMessage(error),
      status: error.status,
      statusText: error.statusText,
      originalError: error,
      timestamp,
      context,
    };

    return errorDetails;
  }

  /**
   * Process generic error
   */
  private static processGenericError(
    error: unknown,
    options: ErrorHandlerOptions
  ): ErrorDetails {
    const { context, customMessage } = options;
    const timestamp = new Date().toISOString();

    let message = customMessage || 'Ha ocurrido un error inesperado';

    if (error instanceof Error) {
      message = customMessage || error.message;
    } else if (typeof error === 'string') {
      message = customMessage || error;
    }

    return {
      message,
      originalError: error,
      timestamp,
      context,
    };
  }

  /**
   * Get user-friendly message based on HTTP status code
   */
  private static getHttpErrorMessage(error: HttpErrorResponse): string {
    // Check if error has a custom message from API
    if (error.error?.message) {
      return error.error.message;
    }

    switch (error.status) {
      case 0:
        return 'No se puede conectar al servidor. Verifique su conexión a internet.';
      case 400:
        return 'Solicitud inválida. Por favor, verifique los datos ingresados.';
      case 401:
        return 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
      case 403:
        return 'No tiene permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 409:
        return 'Ya existe un recurso con esos datos.';
      case 422:
        return 'Los datos proporcionados no son válidos.';
      case 500:
        return 'Error interno del servidor. Por favor, intente nuevamente más tarde.';
      case 502:
        return 'El servidor no está disponible. Por favor, intente nuevamente.';
      case 503:
        return 'El servicio no está disponible temporalmente. Por favor, intente más tarde.';
      case 504:
        return 'Tiempo de espera agotado. Por favor, intente nuevamente.';
      default:
        return `Error inesperado: ${error.statusText || 'Sin descripción'}`;
    }
  }

  /**
   * Determine error type based on HTTP status
   */
  static getErrorType(error: unknown): ErrorType {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return ErrorType.NETWORK;
        case 400:
        case 422:
          return ErrorType.VALIDATION;
        case 401:
          return ErrorType.AUTHENTICATION;
        case 403:
          return ErrorType.AUTHORIZATION;
        case 404:
          return ErrorType.NOT_FOUND;
        case 409:
          return ErrorType.CONFLICT;
        case 500:
        case 502:
        case 503:
        case 504:
          return ErrorType.SERVER;
        default:
          return ErrorType.HTTP;
      }
    }
    return ErrorType.UNKNOWN;
  }

  /**
   * Extract validation errors from API response
   */
  static extractValidationErrors(error: HttpErrorResponse): ValidationError[] {
    const validationErrors: ValidationError[] = [];

    if (error.status === 400 && error.error?.errors) {
      const errors = error.error.errors;

      // Handle array of validation errors
      if (Array.isArray(errors)) {
        errors.forEach((err: { field: string; message: string }) => {
          validationErrors.push({
            field: err.field || 'general',
            message: err.message || 'Error de validación',
          });
        });
      }
      // Handle object with field keys
      else if (typeof errors === 'object') {
        Object.keys(errors).forEach((field) => {
          const message = Array.isArray(errors[field])
            ? errors[field][0]
            : errors[field];
          validationErrors.push({ field, message });
        });
      }
    }

    return validationErrors;
  }

  /**
   * Check if error is retryable
   */
  static isRetryable(error: unknown): boolean {
    if (error instanceof HttpErrorResponse) {
      // Retry on network errors or specific server errors
      return error.status === 0 || error.status === 502 || error.status === 503 || error.status === 504;
    }
    return false;
  }

  /**
   * Log error to console with proper formatting
   */
  private static logError(errorDetails: ErrorDetails): void {
    const { message, status, statusText, context, timestamp, originalError } = errorDetails;

    console.group(`🔴 Error ${status ? `[${status}]` : ''} - ${timestamp}`);

    if (context) {
      console.log('📍 Context:', context);
    }

    console.log('💬 Message:', message);

    if (status && statusText) {
      console.log('📊 Status:', `${status} ${statusText}`);
    }

    if (originalError) {
      console.log('🔍 Original Error:', originalError);
    }

    console.groupEnd();
  }

  /**
   * Safe error handler for try-catch blocks
   * Returns ErrorDetails instead of throwing
   */
  static safeHandle(error: unknown, options: ErrorHandlerOptions = {}): ErrorDetails {
    if (error instanceof HttpErrorResponse) {
      return this.processHttpError(error, options);
    }
    return this.processGenericError(error, options);
  }
}

/**
 * Utility function for handling errors in RxJS pipes
 *
 * @example
 * this.http.get(url).pipe(
 *   handleError({ context: 'Fetching users' })
 * )
 */
export function handleError(options: ErrorHandlerOptions = {}) {
  return (error: unknown): Observable<never> => {
    if (error instanceof HttpErrorResponse) {
      return ErrorHandler.handleHttpError(error, options);
    }
    return ErrorHandler.handleError(error, options);
  };
}

/**
 * Create a type-safe error catcher for try-catch blocks
 *
 * @example
 * const errorCatcher = createErrorCatcher({ context: 'Login process' });
 * try {
 *   // ... code
 * } catch (error) {
 *   const errorDetails = errorCatcher(error);
 *   notificationService.error(errorDetails.message);
 * }
 */
export function createErrorCatcher(options: ErrorHandlerOptions = {}) {
  return (error: unknown): ErrorDetails => {
    return ErrorHandler.safeHandle(error, options);
  };
}
