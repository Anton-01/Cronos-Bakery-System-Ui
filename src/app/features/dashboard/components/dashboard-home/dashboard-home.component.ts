import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  loading = true;
  statCards: StatCard[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // TODO: Replace with actual API call
    setTimeout(() => {
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
          route: '/inventory',
          change: 2,
          changeType: 'decrease',
        },
      ];
      this.loading = false;
    }, 1000);
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
