import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';

import { DashboardService, DashboardStats, RecentActivity } from '../../../../core/services/dashboard.service';
import { NotificationService } from '../../../../core/services/notification.service';

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  route: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly notificationService = inject(NotificationService);

  loading = true;
  statCards: StatCard[] = [];
  recentActivity: RecentActivity[] = [];
  lowStockAlerts: any[] = [];
  stats: DashboardStats | null = null;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    forkJoin({
      stats: this.dashboardService.getAggregatedStats(),
      activity: this.dashboardService.getRecentActivity(5),
      lowStock: this.dashboardService.getLowStockAlerts(),
    }).subscribe({
      next: ({ stats, activity, lowStock }) => {
        this.stats = stats;
        this.recentActivity = activity;
        this.lowStockAlerts = lowStock;
        this.buildStatCards(stats);
        this.loading = false;
      },
      error: error => {
        console.error('Error loading dashboard data:', error);
        // Fallback to mock data if API is not ready
        this.loadMockData();
        this.loading = false;
      },
    });
  }

  private buildStatCards(stats: DashboardStats): void {
    this.statCards = [
      {
        title: 'Materias Primas',
        value: stats.activeRawMaterials,
        icon: 'inventory_2',
        color: '#3f51b5',
        route: '/raw-materials',
      },
      {
        title: 'Recetas',
        value: stats.activeRecipes,
        icon: 'menu_book',
        color: '#4caf50',
        route: '/recipes',
      },
      {
        title: 'Cotizaciones',
        value: stats.totalQuotes,
        icon: 'request_quote',
        color: '#ff9800',
        route: '/quotes',
      },
      {
        title: 'Stock Bajo',
        value: stats.lowStockCount,
        icon: 'warning',
        color: '#f44336',
        route: '/raw-materials',
      },
    ];
  }

  private loadMockData(): void {
    this.statCards = [
      {
        title: 'Materias Primas',
        value: 45,
        icon: 'inventory_2',
        color: '#3f51b5',
        route: '/raw-materials',
        change: 12,
        changeType: 'increase',
      },
      {
        title: 'Recetas',
        value: 28,
        icon: 'menu_book',
        color: '#4caf50',
        route: '/recipes',
        change: 5,
        changeType: 'increase',
      },
      {
        title: 'Cotizaciones',
        value: 15,
        icon: 'request_quote',
        color: '#ff9800',
        route: '/quotes',
        change: 3,
        changeType: 'increase',
      },
      {
        title: 'Stock Bajo',
        value: 8,
        icon: 'warning',
        color: '#f44336',
        route: '/raw-materials',
        change: 2,
        changeType: 'decrease',
      },
    ];
  }

  getChangeClass(changeType?: 'increase' | 'decrease'): string {
    if (!changeType) return '';
    return changeType === 'increase' ? 'change-positive' : 'change-negative';
  }

  getChangeIcon(changeType?: 'increase' | 'decrease'): string {
    if (!changeType) return '';
    return changeType === 'increase' ? 'trending_up' : 'trending_down';
  }
}
