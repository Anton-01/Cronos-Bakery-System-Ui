import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserSession,
  BrandingConfig,
  UpdateBrandingRequest,
} from '../../shared/models/profile.model';
import { ApiResponse } from '../../shared/models';
import { extractData } from '../../shared/operators/api-response.operator';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/profile`;

  // ==================== User Profile ====================

  /**
   * Get current user profile
   */
  getProfile(): Observable<UserProfile> {
    return this.http.get<ApiResponse<UserProfile>>(this.apiUrl)
      .pipe(extractData());
  }

  /**
   * Update user profile
   */
  updateProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<ApiResponse<UserProfile>>(this.apiUrl, request)
      .pipe(extractData());
  }

  /**
   * Upload profile picture
   */
  uploadProfilePicture(file: File): Observable<{ profilePictureUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ profilePictureUrl: string }>>(
      `${this.apiUrl}/profile-picture`,
      formData
    ).pipe(extractData());
  }

  /**
   * Delete profile picture
   */
  deleteProfilePicture(): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/profile-picture`)
      .pipe(extractData());
  }

  // ==================== Password Management ====================

  /**
   * Change password
   */
  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/change-password`, request)
      .pipe(extractData());
  }

  // ==================== Two-Factor Authentication ====================

  /**
   * Enable 2FA
   */
  enableTwoFactorAuth(): Observable<{ qrCodeUrl: string; secret: string }> {
    return this.http.post<ApiResponse<{ qrCodeUrl: string; secret: string }>>(
      `${this.apiUrl}/2fa/enable`,
      {}
    ).pipe(extractData());
  }

  /**
   * Confirm 2FA setup with verification code
   */
  confirmTwoFactorAuth(code: string): Observable<{ backupCodes: string[] }> {
    return this.http.post<ApiResponse<{ backupCodes: string[] }>>(`${this.apiUrl}/2fa/confirm`, { code })
      .pipe(extractData());
  }

  /**
   * Disable 2FA
   */
  disableTwoFactorAuth(password: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/2fa/disable`, { password })
      .pipe(extractData());
  }

  /**
   * Generate new backup codes
   */
  regenerateBackupCodes(): Observable<{ backupCodes: string[] }> {
    return this.http.post<ApiResponse<{ backupCodes: string[] }>>(`${this.apiUrl}/2fa/regenerate-codes`, {})
      .pipe(extractData());
  }

  // ==================== Sessions ====================

  /**
   * Get active sessions
   */
  getSessions(): Observable<UserSession[]> {
    return this.http.get<ApiResponse<UserSession[]>>(`${this.apiUrl}/sessions`)
      .pipe(extractData());
  }

  /**
   * Revoke session
   */
  revokeSession(sessionId: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/sessions/${sessionId}`)
      .pipe(extractData());
  }

  /**
   * Revoke all sessions except current
   */
  revokeAllOtherSessions(): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/sessions/revoke-all-others`, {})
      .pipe(extractData());
  }

  // ==================== Branding Configuration ====================

  /**
   * Get branding configuration
   */
  getBrandingConfig(): Observable<BrandingConfig> {
    return this.http.get<ApiResponse<BrandingConfig>>(`${environment.apiUrl}/branding`)
      .pipe(extractData());
  }

  /**
   * Update branding configuration
   */
  updateBrandingConfig(request: UpdateBrandingRequest): Observable<BrandingConfig> {
    return this.http.put<ApiResponse<BrandingConfig>>(`${environment.apiUrl}/branding`, request)
      .pipe(extractData());
  }

  /**
   * Upload company logo
   */
  uploadLogo(file: File): Observable<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ logoUrl: string }>>(`${environment.apiUrl}/branding/logo`, formData)
      .pipe(extractData());
  }

  /**
   * Delete company logo
   */
  deleteLogo(): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/branding/logo`)
      .pipe(extractData());
  }

  /**
   * Reset branding to defaults
   */
  resetBrandingToDefaults(): Observable<BrandingConfig> {
    return this.http.post<ApiResponse<BrandingConfig>>(`${environment.apiUrl}/branding/reset`, {})
      .pipe(extractData());
  }

  // ==================== Notifications Preferences ====================

  /**
   * Get notification preferences
   */
  getNotificationPreferences(): Observable<{
    emailNotifications: boolean;
    quotesNotifications: boolean;
    lowStockNotifications: boolean;
    expiringQuotesNotifications: boolean;
    weeklyReports: boolean;
  }> {
    return this.http.get<ApiResponse<{
      emailNotifications: boolean;
      quotesNotifications: boolean;
      lowStockNotifications: boolean;
      expiringQuotesNotifications: boolean;
      weeklyReports: boolean;
    }>>(`${this.apiUrl}/notifications`).pipe(extractData());
  }

  /**
   * Update notification preferences
   */
  updateNotificationPreferences(preferences: {
    emailNotifications?: boolean;
    quotesNotifications?: boolean;
    lowStockNotifications?: boolean;
    expiringQuotesNotifications?: boolean;
    weeklyReports?: boolean;
  }): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/notifications`, preferences)
      .pipe(extractData());
  }

  // ==================== Account Management ====================

  /**
   * Delete account
   */
  deleteAccount(password: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/delete-account`, { password })
      .pipe(extractData());
  }

  /**
   * Export user data (GDPR compliance)
   */
  exportUserData(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-data`, {
      responseType: 'blob',
    });
  }
}
