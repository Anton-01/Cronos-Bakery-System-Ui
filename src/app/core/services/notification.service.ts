import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/**
 * Service for displaying notifications to the user
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private toastr = inject(ToastrService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  /**
   * Show success notification
   */
  success(message: string, title?: string): void {
    this.toastr.success(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Show error notification
   */
  error(message: string, title?: string): void {
    this.toastr.error(message, title, {
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Show warning notification
   */
  warning(message: string, title?: string): void {
    this.toastr.warning(message, title, {
      timeOut: 4000,
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Show info notification
   */
  info(message: string, title?: string): void {
    this.toastr.info(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.toastr.clear();
  }

  /**
   * Show persistent notification (doesn't auto-close)
   */
  persistent(message: string, title?: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    this.toastr[type](message, title, {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: true,
    });
  }

  // Aliases for backward compatibility
  showSuccess(message: string, title?: string): void {
    this.success(message, title);
  }

  showError(message: string, title?: string): void {
    this.error(message, title);
  }

  showWarning(message: string, title?: string): void {
    this.warning(message, title);
  }

  showInfo(message: string, title?: string): void {
    this.info(message, title);
  }
}
