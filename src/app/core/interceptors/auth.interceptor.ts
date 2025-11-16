import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
      return next.handle(req);
    }

    const accessToken = this.authService.getAccessToken();
    let authReq = req;
    if (accessToken) {
      authReq = this.addTokenHeader(req, accessToken);
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }


  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(switchMap((tokenResponse) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(tokenResponse.accessToken);
          return next.handle( this.addTokenHeader(request, tokenResponse.accessToken) );
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => { return next.handle(this.addTokenHeader(request, token!)); })
      );
    }
  }
}

/**
 * Functional HTTP Interceptor to attach JWT token to requests
 * This is the primary interceptor for token management
 */
export const authInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Skip token attachment for auth endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const accessToken = authService.getAccessToken();

  // Attach token if available
  if (accessToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
