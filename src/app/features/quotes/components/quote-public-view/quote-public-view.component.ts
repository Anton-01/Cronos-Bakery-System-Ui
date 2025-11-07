import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { QuotesService } from '../../../../core/services/quotes.service';
import { Quote } from '../../../../shared/models/quote.model';

@Component({
  selector: 'app-quote-public-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  template: `
    <div class="public-quote-container">
      @if (loading) {
        <mat-card>
          <mat-card-content>
            <p>Cargando cotización...</p>
          </mat-card-content>
        </mat-card>
      } @else if (quote) {
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <h1>Cotización #{{ quote.quoteNumber }}</h1>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="quote-info">
              <p><strong>Cliente:</strong> {{ quote.clientName }}</p>
              <p><strong>Email:</strong> {{ quote.clientEmail }}</p>
              <p><strong>Fecha:</strong> {{ quote.createdAt | date: 'dd/MM/yyyy' }}</p>
              <p><strong>Total:</strong> ${{ quote.total | number: '1.2-2' }}</p>
            </div>
            <!-- TODO: Mostrar items de la cotización -->
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="downloadPdf()">
              <mat-icon>download</mat-icon>
              Descargar PDF
            </button>
          </mat-card-actions>
        </mat-card>
      } @else {
        <mat-card>
          <mat-card-content>
            <p>Cotización no encontrada</p>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .public-quote-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .quote-info {
      margin: 20px 0;
    }
  `],
})
export class QuotePublicViewComponent implements OnInit {
  private readonly quotesService = inject(QuotesService);
  private readonly route = inject(ActivatedRoute);

  quote: Quote | null = null;
  loading = true;

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.loadQuote(token);
    }
  }

  loadQuote(token: string): void {
    this.quotesService.getQuoteByToken(token).subscribe({
      next: quote => {
        this.quote = quote;
        this.loading = false;
      },
      error: error => {
        console.error('Error loading quote:', error);
        this.loading = false;
      },
    });
  }

  downloadPdf(): void {
    if (this.quote) {
      this.quotesService.downloadPdf(this.quote.id);
    }
  }
}
