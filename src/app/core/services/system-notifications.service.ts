import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SystemNotification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  link?: string;
}

/**
 * Service for managing system notifications (header notifications)
 */
@Injectable({
  providedIn: 'root',
})
export class SystemNotificationsService {
  private notificationsSubject = new BehaviorSubject<SystemNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    this.loadNotifications();
  }

  /**
   * Get all notifications
   */
  getNotifications(): Observable<SystemNotification[]> {
    return this.notifications$;
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): Observable<number> {
    return this.unreadCount$;
  }

  /**
   * Add a new notification
   */
  addNotification(notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>): void {
    const notifications = this.notificationsSubject.value;
    const newNotification: SystemNotification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date(),
      read: false,
    };

    const updatedNotifications = [newNotification, ...notifications];
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
    this.saveNotifications(updatedNotifications);
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: number): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );

    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
    this.saveNotifications(updatedNotifications);
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));

    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
    this.saveNotifications(updatedNotifications);
  }

  /**
   * Delete a notification
   */
  deleteNotification(id: number): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.filter(n => n.id !== id);

    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
    this.saveNotifications(updatedNotifications);
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
    this.saveNotifications([]);
  }

  /**
   * Load notifications from localStorage
   */
  private loadNotifications(): void {
    try {
      const stored = localStorage.getItem('system_notifications');
      if (stored) {
        const notifications: SystemNotification[] = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const parsedNotifications = notifications.map(n => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        this.notificationsSubject.next(parsedNotifications);
        this.updateUnreadCount(parsedNotifications);
      } else {
        // Add some sample notifications for demo
        this.addSampleNotifications();
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      this.addSampleNotifications();
    }
  }

  /**
   * Save notifications to localStorage
   */
  private saveNotifications(notifications: SystemNotification[]): void {
    try {
      localStorage.setItem('system_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  /**
   * Update unread count
   */
  private updateUnreadCount(notifications: SystemNotification[]): void {
    const unreadCount = notifications.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  /**
   * Add sample notifications for demonstration
   */
  private addSampleNotifications(): void {
    const samples: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>[] = [
      {
        title: 'Stock bajo',
        message: 'La harina integral tiene stock bajo (5 unidades restantes)',
        type: 'warning',
        link: '/raw-materials',
      },
      {
        title: 'Nueva cotización',
        message: 'Se ha creado una nueva cotización para el cliente XYZ',
        type: 'info',
        link: '/quotes',
      },
      {
        title: 'Receta actualizada',
        message: 'La receta "Pan de molde" ha sido actualizada',
        type: 'success',
        link: '/recipes',
      },
    ];

    samples.forEach(sample => this.addNotification(sample));
  }
}
