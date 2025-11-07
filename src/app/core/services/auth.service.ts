import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  TokenResponse,
  User,
  UserResponse,
} from '../../shared/models';
import { StorageService } from './storage.service';

/**
 * Authentication service
 * Handles user authentication, token management, and authorization
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.storage.getUserData<User>());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Get current user value
   */
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Login with username and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, credentials).pipe(
      map((response) => response.data),
      tap((loginResponse) => {
        this.handleLoginResponse(loginResponse);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user
   */
  register(user: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<ApiResponse<UserResponse>>(`${this.API_URL}/register`, user).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.storage.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<ApiResponse<TokenResponse>>(`${this.API_URL}/refresh`, request).pipe(
      map((response) => response.data),
      tap((tokenResponse) => {
        this.storage.setAccessToken(tokenResponse.accessToken);
      }),
      catchError((error) => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    const token = this.storage.getAccessToken();
    if (token) {
      // Call backend logout endpoint (fire and forget)
      this.http.post(`${this.API_URL}/logout`, {}).subscribe({
        error: (error) => console.error('Logout error:', error),
      });
    }

    this.clearUserData();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.storage.getAccessToken();
    if (!token) {
      return false;
    }

    // Check if token is expired
    try {
      const payload = this.decodeToken(token);
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp > now;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.storage.getAccessToken();
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.storage.getRefreshToken();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.roles.includes(role) : false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    return user ? roles.some((role) => user.roles.includes(role)) : false;
  }

  /**
   * Decode JWT token
   */
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Handle login response
   */
  private handleLoginResponse(loginResponse: LoginResponse): void {
    // Store tokens
    this.storage.setAccessToken(loginResponse.accessToken);
    this.storage.setRefreshToken(loginResponse.refreshToken);

    // Extract user data from token
    const user: User = {
      id: 0, // Will be set from token payload
      username: loginResponse.username,
      email: loginResponse.email,
      firstName: '',
      lastName: '',
      roles: loginResponse.roles,
    };

    // Decode token to get user id
    const payload = this.decodeToken(loginResponse.accessToken);
    if (payload && payload.sub) {
      user.id = parseInt(payload.sub, 10);
    }

    // Store user data
    this.storage.setUserData(user);
    this.currentUserSubject.next(user);
  }

  /**
   * Clear user data from storage
   */
  private clearUserData(): void {
    this.storage.clear();
    this.currentUserSubject.next(null);
  }
}
