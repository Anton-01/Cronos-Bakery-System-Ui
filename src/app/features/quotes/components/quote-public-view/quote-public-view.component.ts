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
  templateUrl: './quote-public-view.component.html',
  styles: [`
    .public-quote-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .quote-info {
      margin: 20px 0;
    }
    .quote-items {
      margin-top: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      font-weight: bold;
      background-color: #f5f5f5;
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
