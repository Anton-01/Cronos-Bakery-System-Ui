import { Injectable } from '@angular/core';

/**
 * Service for secure data storage
 * Uses localStorage with session management for 30-minute sessions
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_DATA_KEY = 'user_data';
  private readonly SESSION_TIMESTAMP_KEY = 'session_timestamp';
  private readonly LAST_ACTIVITY_KEY = 'last_activity';
  private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  /**
   * Save access token and update session timestamp
   */
  setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    this.updateSessionTimestamp();
    this.updateLastActivity();
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
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
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(data));
  }

  /**
   * Get user data
   */
  getUserData<T>(): T | null {
    const data = localStorage.getItem(this.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Update session timestamp to current time
   */
  updateSessionTimestamp(): void {
    localStorage.setItem(this.SESSION_TIMESTAMP_KEY, Date.now().toString());
  }

  /**
   * Update last activity timestamp
   */
  updateLastActivity(): void {
    localStorage.setItem(this.LAST_ACTIVITY_KEY, Date.now().toString());
  }

  /**
   * Get session timestamp
   */
  getSessionTimestamp(): number | null {
    const timestamp = localStorage.getItem(this.SESSION_TIMESTAMP_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  }

  /**
   * Get last activity timestamp
   */
  getLastActivity(): number | null {
    const timestamp = localStorage.getItem(this.LAST_ACTIVITY_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  }

  /**
   * Check if session is active (within 30 minutes)
   */
  isSessionActive(): boolean {
    const lastActivity = this.getLastActivity();
    if (!lastActivity) {
      return false;
    }
    const now = Date.now();
    return (now - lastActivity) < this.SESSION_DURATION;
  }

  /**
   * Check if session exists (has tokens)
   */
  hasSession(): boolean {
    return !!this.getAccessToken() || !!this.getRefreshToken();
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
