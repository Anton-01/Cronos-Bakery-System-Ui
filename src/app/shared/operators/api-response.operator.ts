import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models';

/**
 * Operator to extract data from ApiResponse wrapper
 * Use this to unwrap backend responses that come in the format:
 * { success: boolean, message: string, data: T, timestamp: string }
 */
export function extractData<T>() {
  return (source: Observable<ApiResponse<T>>): Observable<T> => {
    return source.pipe(map((response) => response.data));
  };
}
