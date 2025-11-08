/**
 * Common models used across the application
 */

/**
 * Paginated response from API
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * Sort configuration
 */
export interface Sort {
  property: string;
  direction: 'ASC' | 'DESC';
}

/**
 * Page request parameters
 */
export interface PageRequest {
  page: number;
  size: number;
  sort?: Sort[];
}
