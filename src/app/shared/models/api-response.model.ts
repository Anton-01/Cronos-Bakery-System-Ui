/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Error Response from API
 */
export interface ErrorResponse {
  success: false;
  message: string;
  data: null;
  timestamp: string;
  errors?: FieldError[];
}

/**
 * Field validation error
 */
export interface FieldError {
  field: string;
  message: string;
}
