import { Injectable } from '@angular/core';

/**
 * Service for secure data storage
 * Uses sessionStorage for better security (tokens cleared on tab close)
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_DATA_KEY = 'user_data';

  /**
   * Save access token
   */
  setAccessToken(token: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Save refresh token (in localStorage for persistence)
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Save user data
   */
  setUserData(data: unknown): void {
    sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify(data));
  }

  /**
   * Get user data
   */
  getUserData<T>(): T | null {
    const data = sessionStorage.getItem(this.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Remove access token
   */
  removeAccessToken(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Remove refresh token
   */
  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Remove user data
   */
  removeUserData(): void {
    sessionStorage.removeItem(this.USER_DATA_KEY);
  }

  /**
   * Clear all stored data
   */
  clear(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUserData();
  }

  /**
   * Generic set item
   */
  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  /**
   * Generic get item
   */
  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  /**
   * Generic remove item
   */
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
}
