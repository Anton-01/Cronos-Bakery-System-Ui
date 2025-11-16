import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Quote, CreateQuoteRequest, UpdateQuoteRequest, QuoteStatus, } from '../../shared/models';
import { PageResponse } from '../../shared/models/common.model';
import { ApiResponse } from '../../shared/models';
import { extractData } from '../../shared/operators/api-response.operator';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/quotes`;

  // ==================== Quotes ====================

  /**
   * Get paginated list of quotes with optional filters
   */
  getQuotes(
    page: number = 0,
    size: number = 10,
    sort?: string,
    filters?: {
      clientName?: string;
      status?: QuoteStatus;
      fromDate?: string;
      toDate?: string;
      minTotal?: number;
      maxTotal?: number;
    }
  ): Observable<PageResponse<Quote>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    if (filters?.clientName) {
      params = params.set('clientName', filters.clientName);
    }

    if (filters?.status) {
      params = params.set('status', filters.status);
    }

    if (filters?.fromDate) {
      params = params.set('fromDate', filters.fromDate);
    }

    if (filters?.toDate) {
      params = params.set('toDate', filters.toDate);
    }

    if (filters?.minTotal !== undefined) {
      params = params.set('minTotal', filters.minTotal.toString());
    }

    if (filters?.maxTotal !== undefined) {
      params = params.set('maxTotal', filters.maxTotal.toString());
    }

    return this.http.get<ApiResponse<PageResponse<Quote>>>(this.apiUrl, { params })
      .pipe(extractData());
  }

  /**
   * Get quote by ID
   */
  getQuoteById(id: number): Observable<Quote> {
    return this.http.get<ApiResponse<Quote>>(`${this.apiUrl}/${id}`)
      .pipe(extractData());
  }

  /**
   * Get quote by public token (for sharing)
   */
  getQuoteByToken(token: string): Observable<Quote> {
    return this.http.get<ApiResponse<Quote>>(`${environment.apiUrl}/public/quotes/${token}`)
      .pipe(extractData());
  }

  /**
   * Create new quote
   */
  createQuote(request: CreateQuoteRequest): Observable<Quote> {
    return this.http.post<ApiResponse<Quote>>(this.apiUrl, request)
      .pipe(extractData());
  }

  /**
   * Update existing quote
   */
  updateQuote(id: number, request: UpdateQuoteRequest): Observable<Quote> {
    return this.http.put<ApiResponse<Quote>>(`${this.apiUrl}/${id}`, request)
      .pipe(extractData());
  }

  /**
   * Delete quote (soft delete)
   */
  deleteQuote(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(extractData());
  }

  /**
   * Restore deleted quote
   */
  restoreQuote(id: number): Observable<Quote> {
    return this.http.put<ApiResponse<Quote>>(`${this.apiUrl}/${id}/restore`, {})
      .pipe(extractData());
  }

  /**
   * Duplicate quote
   */
  duplicateQuote(id: number): Observable<Quote> {
    return this.http.post<ApiResponse<Quote>>(`${this.apiUrl}/${id}/duplicate`, {})
      .pipe(extractData());
  }

  // ==================== Quote Status Management ====================

  /**
   * Update quote status
   */
  updateQuoteStatus(id: number, status: QuoteStatus): Observable<Quote> {
    return this.http.put<ApiResponse<Quote>>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(extractData());
  }

  /**
   * Mark quote as sent
   */
  markAsSent(id: number): Observable<Quote> {
    return this.updateQuoteStatus(id, QuoteStatus.SENT);
  }

  /**
   * Mark quote as accepted
   */
  markAsAccepted(id: number): Observable<Quote> {
    return this.updateQuoteStatus(id, QuoteStatus.ACCEPTED);
  }

  /**
   * Mark quote as rejected
   */
  markAsRejected(id: number): Observable<Quote> {
    return this.updateQuoteStatus(id, QuoteStatus.REJECTED);
  }

  /**
   * Mark quote as expired
   */
  markAsExpired(id: number): Observable<Quote> {
    return this.updateQuoteStatus(id, QuoteStatus.EXPIRED);
  }

  // ==================== Quote Sharing ====================

  /**
   * Generate public shareable link
   */
  generatePublicLink(id: number): Observable<{ publicToken: string; publicUrl: string }> {
    return this.http.post<ApiResponse<{ publicToken: string; publicUrl: string }>>(
      `${this.apiUrl}/${id}/generate-link`,
      {}
    ).pipe(extractData());
  }

  /**
   * Revoke public link
   */
  revokePublicLink(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}/public-link`)
      .pipe(extractData());
  }

  // ==================== Quote Export ====================

  /**
   * Export quote to PDF
   */
  exportToPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/export/pdf`, {
      responseType: 'blob',
    });
  }

  /**
   * Export quote to Excel
   */
  exportToExcel(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/export/excel`, {
      responseType: 'blob',
    });
  }

  /**
   * Download quote as PDF
   */
  downloadPdf(id: number, filename?: string): void {
    this.exportToPdf(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `quote-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // ==================== Email Operations ====================

  /**
   * Send quote via email
   */
  sendQuoteByEmail(
    id: number,
    emailData: {
      to: string;
      cc?: string[];
      subject?: string;
      message?: string;
      includeAttachment?: boolean;
    }
  ): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/send-email`, emailData)
      .pipe(extractData());
  }

  /**
   * Preview email template
   */
  previewEmailTemplate(id: number): Observable<{ subject: string; htmlContent: string }> {
    return this.http.get<ApiResponse<{ subject: string; htmlContent: string }>>(
      `${this.apiUrl}/${id}/email-preview`
    ).pipe(extractData());
  }

  // ==================== Statistics ====================

  /**
   * Get quotes statistics
   */
  getStatistics(): Observable<{
    totalQuotes: number;
    draftQuotes: number;
    sentQuotes: number;
    acceptedQuotes: number;
    rejectedQuotes: number;
    expiredQuotes: number;
    totalRevenue: number;
    averageQuoteValue: number;
    conversionRate: number;
  }> {
    return this.http.get<ApiResponse<{
      totalQuotes: number;
      draftQuotes: number;
      sentQuotes: number;
      acceptedQuotes: number;
      rejectedQuotes: number;
      expiredQuotes: number;
      totalRevenue: number;
      averageQuoteValue: number;
      conversionRate: number;
    }>>(`${this.apiUrl}/statistics`).pipe(extractData());
  }

  /**
   * Get quotes by status
   */
  getQuotesByStatus(status: QuoteStatus): Observable<Quote[]> {
    return this.http.get<ApiResponse<Quote[]>>(`${this.apiUrl}/by-status/${status}`)
      .pipe(extractData());
  }

  /**
   * Get recent quotes
   */
  getRecentQuotes(limit: number = 10): Observable<Quote[]> {
    return this.http.get<ApiResponse<Quote[]>>(`${this.apiUrl}/recent`, {
      params: new HttpParams().set('limit', limit.toString()),
    }).pipe(extractData());
  }

  /**
   * Get expiring quotes (quotes about to expire)
   */
  getExpiringQuotes(daysUntilExpiry: number = 7): Observable<Quote[]> {
    return this.http.get<ApiResponse<Quote[]>>(`${this.apiUrl}/expiring`, {
      params: new HttpParams().set('days', daysUntilExpiry.toString()),
    }).pipe(extractData());
  }

  // ==================== Batch Operations ====================

  /**
   * Batch update quote status
   */
  batchUpdateStatus(quoteIds: number[], status: QuoteStatus): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/batch/status`, {
      quoteIds,
      status,
    }).pipe(extractData());
  }

  /**
   * Batch delete quotes
   */
  batchDelete(quoteIds: number[]): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/batch/delete`, { quoteIds })
      .pipe(extractData());
  }

  /**
   * Batch send quotes by email
   */
  batchSendEmails(quoteIds: number[]): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/batch/send-emails`, { quoteIds })
      .pipe(extractData());
  }
}
