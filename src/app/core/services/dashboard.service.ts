import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models';
import { extractData } from '../../shared/operators/api-response.operator';

export interface DashboardStats {
  totalRawMaterials: number;
  activeRawMaterials: number;
  lowStockCount: number;
  totalRecipes: number;
  activeRecipes: number;
  totalQuotes: number;
  draftQuotes: number;
  sentQuotes: number;
  acceptedQuotes: number;
  totalRevenue: number;
  conversionRate: number;
}

export interface RecentActivity {
  id: number;
  type: 'QUOTE_CREATED' | 'QUOTE_SENT' | 'QUOTE_ACCEPTED' | 'RECIPE_CREATED' | 'MATERIAL_LOW_STOCK';
  description: string;
  timestamp: string;
  userId: number;
  userName: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  // ==================== Dashboard Statistics ====================

  /**
   * Get complete dashboard statistics
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/stats`)
      .pipe(extractData());
  }

  /**
   * Get aggregated statistics from all modules
   */
  getAggregatedStats(): Observable<DashboardStats> {
    return forkJoin({
      rawMaterials: this.http.get<ApiResponse<{
        totalRawMaterials: number;
        activeRawMaterials: number;
        lowStockCount: number;
      }>>(`${environment.apiUrl}/raw-materials/statistics`).pipe(extractData()),
      recipes: this.http.get<ApiResponse<{
        totalRecipes: number;
        activeRecipes: number;
      }>>(`${environment.apiUrl}/recipes/statistics`).pipe(extractData()),
      quotes: this.http.get<ApiResponse<{
        totalQuotes: number;
        draftQuotes: number;
        sentQuotes: number;
        acceptedQuotes: number;
        totalRevenue: number;
        conversionRate: number;
      }>>(`${environment.apiUrl}/quotes/statistics`).pipe(extractData()),
    }).pipe(
      map(({ rawMaterials, recipes, quotes }) => ({
        totalRawMaterials: rawMaterials.totalRawMaterials,
        activeRawMaterials: rawMaterials.activeRawMaterials,
        lowStockCount: rawMaterials.lowStockCount,
        totalRecipes: recipes.totalRecipes,
        activeRecipes: recipes.activeRecipes,
        totalQuotes: quotes.totalQuotes,
        draftQuotes: quotes.draftQuotes,
        sentQuotes: quotes.sentQuotes,
        acceptedQuotes: quotes.acceptedQuotes,
        totalRevenue: quotes.totalRevenue,
        conversionRate: quotes.conversionRate,
      }))
    );
  }

  // ==================== Recent Activity ====================

  /**
   * Get recent activity feed
   */
  getRecentActivity(limit: number = 10): Observable<RecentActivity[]> {
    return this.http.get<ApiResponse<RecentActivity[]>>(`${this.apiUrl}/activity`, {
      params: new HttpParams().set('limit', limit.toString()),
    }).pipe(extractData());
  }

  // ==================== Charts & Analytics ====================

  /**
   * Get quotes by status chart data
   */
  getQuotesByStatusChart(): Observable<ChartData> {
    return this.http.get<ApiResponse<ChartData>>(`${this.apiUrl}/charts/quotes-by-status`)
      .pipe(extractData());
  }

  /**
   * Get revenue over time chart data
   */
  getRevenueOverTimeChart(period: 'week' | 'month' | 'year' = 'month'): Observable<ChartData> {
    return this.http.get<ApiResponse<ChartData>>(`${this.apiUrl}/charts/revenue-over-time`, {
      params: new HttpParams().set('period', period),
    }).pipe(extractData());
  }

  /**
   * Get top recipes by usage chart data
   */
  getTopRecipesChart(limit: number = 10): Observable<ChartData> {
    return this.http.get<ApiResponse<ChartData>>(`${this.apiUrl}/charts/top-recipes`, {
      params: new HttpParams().set('limit', limit.toString()),
    }).pipe(extractData());
  }

  /**
   * Get materials by category chart data
   */
  getMaterialsByCategoryChart(): Observable<ChartData> {
    return this.http.get<ApiResponse<ChartData>>(`${this.apiUrl}/charts/materials-by-category`)
      .pipe(extractData());
  }

  /**
   * Get quote conversion rate over time
   */
  getQuoteConversionChart(period: 'week' | 'month' | 'year' = 'month'): Observable<ChartData> {
    return this.http.get<ApiResponse<ChartData>>(`${this.apiUrl}/charts/quote-conversion`, {
      params: new HttpParams().set('period', period),
    }).pipe(extractData());
  }

  // ==================== Alerts & Notifications ====================

  /**
   * Get low stock alerts
   */
  getLowStockAlerts(): Observable<
    Array<{
      rawMaterialId: number;
      rawMaterialName: string;
      currentStock: number;
      minimumStock: number;
      unitName: string;
    }>
  > {
    return this.http.get<ApiResponse<Array<{
      rawMaterialId: number;
      rawMaterialName: string;
      currentStock: number;
      minimumStock: number;
      unitName: string;
    }>>>(`${this.apiUrl}/alerts/low-stock`).pipe(extractData());
  }

  /**
   * Get expiring quotes alerts
   */
  getExpiringQuotesAlerts(daysUntilExpiry: number = 7): Observable<
    Array<{
      quoteId: number;
      clientName: string;
      expiryDate: string;
      daysUntilExpiry: number;
      total: number;
    }>
  > {
    return this.http.get<ApiResponse<Array<{
      quoteId: number;
      clientName: string;
      expiryDate: string;
      daysUntilExpiry: number;
      total: number;
    }>>>(`${this.apiUrl}/alerts/expiring-quotes`, {
      params: new HttpParams().set('days', daysUntilExpiry.toString()),
    }).pipe(extractData());
  }

  /**
   * Get pending quotes count
   */
  getPendingQuotesCount(): Observable<number> {
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/alerts/pending-quotes-count`)
      .pipe(extractData());
  }

  // ==================== Summary Reports ====================

  /**
   * Get daily summary
   */
  getDailySummary(date?: string): Observable<{
    date: string;
    quotesCreated: number;
    quotesSent: number;
    quotesAccepted: number;
    revenueGenerated: number;
    materialsAdded: number;
    recipesCreated: number;
  }> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<ApiResponse<{
      date: string;
      quotesCreated: number;
      quotesSent: number;
      quotesAccepted: number;
      revenueGenerated: number;
      materialsAdded: number;
      recipesCreated: number;
    }>>(`${this.apiUrl}/summary/daily`, { params }).pipe(extractData());
  }

  /**
   * Get weekly summary
   */
  getWeeklySummary(weekStart?: string): Observable<{
    weekStart: string;
    weekEnd: string;
    quotesCreated: number;
    quotesSent: number;
    quotesAccepted: number;
    revenueGenerated: number;
    materialsAdded: number;
    recipesCreated: number;
  }> {
    let params = new HttpParams();
    if (weekStart) {
      params = params.set('weekStart', weekStart);
    }
    return this.http.get<ApiResponse<{
      weekStart: string;
      weekEnd: string;
      quotesCreated: number;
      quotesSent: number;
      quotesAccepted: number;
      revenueGenerated: number;
      materialsAdded: number;
      recipesCreated: number;
    }>>(`${this.apiUrl}/summary/weekly`, { params }).pipe(extractData());
  }

  /**
   * Get monthly summary
   */
  getMonthlySummary(year?: number, month?: number): Observable<{
    year: number;
    month: number;
    quotesCreated: number;
    quotesSent: number;
    quotesAccepted: number;
    revenueGenerated: number;
    materialsAdded: number;
    recipesCreated: number;
  }> {
    let params = new HttpParams();
    if (year !== undefined) {
      params = params.set('year', year.toString());
    }
    if (month !== undefined) {
      params = params.set('month', month.toString());
    }
    return this.http.get<ApiResponse<{
      year: number;
      month: number;
      quotesCreated: number;
      quotesSent: number;
      quotesAccepted: number;
      revenueGenerated: number;
      materialsAdded: number;
      recipesCreated: number;
    }>>(`${this.apiUrl}/summary/monthly`, { params }).pipe(extractData());
  }

  // ==================== Export Reports ====================

  /**
   * Export dashboard report to PDF
   */
  exportDashboardReport(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/report`, {
      params: new HttpParams().set('period', period),
      responseType: 'blob',
    });
  }
}
