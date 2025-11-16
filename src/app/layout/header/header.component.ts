import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { SystemNotificationsService, SystemNotification } from '../../core/services/system-notifications.service';
import { User } from '../../shared/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private systemNotificationsService = inject(SystemNotificationsService);
  private router = inject(Router);

  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser$: Observable<User | null>;
  notificationCount$: Observable<number>;
  notifications$: Observable<SystemNotification[]>;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.currentUser$ = this.authService.currentUser$;
    this.notificationCount$ = this.systemNotificationsService.getUnreadCount();
    this.notifications$ = this.systemNotificationsService.getNotifications();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onProfile(): void {
    this.router.navigate(['/settings/profile']);
  }

  onSettings(): void {
    this.router.navigate(['/settings']);
  }

  onLogout(): void {
    this.authService.logout();
  }

  onNotificationClick(notification: SystemNotification): void {
    this.systemNotificationsService.markAsRead(notification.id);
    if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }

  markAllNotificationsAsRead(): void {
    this.systemNotificationsService.markAllAsRead();
  }

  clearAllNotifications(): void {
    this.systemNotificationsService.clearAll();
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'check_circle';
      case 'info':
      default:
        return 'info';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'warning':
        return 'warn';
      case 'error':
        return 'warn';
      case 'success':
        return 'primary';
      case 'info':
      default:
        return 'accent';
    }
  }
}
