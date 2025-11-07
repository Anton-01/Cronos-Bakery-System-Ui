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
    return this.http.get<UserProfile>(this.apiUrl);
  }

  /**
   * Update user profile
   */
  updateProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, request);
  }

  /**
   * Upload profile picture
   */
  uploadProfilePicture(file: File): Observable<{ profilePictureUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ profilePictureUrl: string }>(
      `${this.apiUrl}/profile-picture`,
      formData
    );
  }

  /**
   * Delete profile picture
   */
  deleteProfilePicture(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profile-picture`);
  }

  // ==================== Password Management ====================

  /**
   * Change password
   */
  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, request);
  }

  // ==================== Two-Factor Authentication ====================

  /**
   * Enable 2FA
   */
  enableTwoFactorAuth(): Observable<{ qrCodeUrl: string; secret: string }> {
    return this.http.post<{ qrCodeUrl: string; secret: string }>(
      `${this.apiUrl}/2fa/enable`,
      {}
    );
  }

  /**
   * Confirm 2FA setup with verification code
   */
  confirmTwoFactorAuth(code: string): Observable<{ backupCodes: string[] }> {
    return this.http.post<{ backupCodes: string[] }>(`${this.apiUrl}/2fa/confirm`, { code });
  }

  /**
   * Disable 2FA
   */
  disableTwoFactorAuth(password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/2fa/disable`, { password });
  }

  /**
   * Generate new backup codes
   */
  regenerateBackupCodes(): Observable<{ backupCodes: string[] }> {
    return this.http.post<{ backupCodes: string[] }>(`${this.apiUrl}/2fa/regenerate-codes`, {});
  }

  // ==================== Sessions ====================

  /**
   * Get active sessions
   */
  getSessions(): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(`${this.apiUrl}/sessions`);
  }

  /**
   * Revoke session
   */
  revokeSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions/${sessionId}`);
  }

  /**
   * Revoke all sessions except current
   */
  revokeAllOtherSessions(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/sessions/revoke-all-others`, {});
  }

  // ==================== Branding Configuration ====================

  /**
   * Get branding configuration
   */
  getBrandingConfig(): Observable<BrandingConfig> {
    return this.http.get<BrandingConfig>(`${environment.apiUrl}/branding`);
  }

  /**
   * Update branding configuration
   */
  updateBrandingConfig(request: UpdateBrandingRequest): Observable<BrandingConfig> {
    return this.http.put<BrandingConfig>(`${environment.apiUrl}/branding`, request);
  }

  /**
   * Upload company logo
   */
  uploadLogo(file: File): Observable<{ logoUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ logoUrl: string }>(`${environment.apiUrl}/branding/logo`, formData);
  }

  /**
   * Delete company logo
   */
  deleteLogo(): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/branding/logo`);
  }

  /**
   * Reset branding to defaults
   */
  resetBrandingToDefaults(): Observable<BrandingConfig> {
    return this.http.post<BrandingConfig>(`${environment.apiUrl}/branding/reset`, {});
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
    return this.http.get<{
      emailNotifications: boolean;
      quotesNotifications: boolean;
      lowStockNotifications: boolean;
      expiringQuotesNotifications: boolean;
      weeklyReports: boolean;
    }>(`${this.apiUrl}/notifications`);
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
    return this.http.put<void>(`${this.apiUrl}/notifications`, preferences);
  }

  // ==================== Account Management ====================

  /**
   * Delete account
   */
  deleteAccount(password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete-account`, { password });
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
