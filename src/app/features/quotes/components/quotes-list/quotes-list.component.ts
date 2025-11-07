import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

import { QuotesService } from '../../../../core/services/quotes.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Quote } from '../../../../shared/models/quote.model';

@Component({
  selector: 'app-quotes-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
  ],
  template: `
    <div class="quotes-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <div class="header">
              <h1>Cotizaciones</h1>
              <button mat-raised-button color="primary" routerLink="/quotes/create">
                <mat-icon>add</mat-icon>
                Nueva Cotización
              </button>
            </div>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (loading) {
            <p>Cargando cotizaciones...</p>
          } @else {
            <p>Total de cotizaciones: {{ quotes.length }}</p>
            <!-- TODO: Implementar tabla de cotizaciones con filtros -->
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .quotes-container {
      padding: 24px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  `],
})
export class QuotesListComponent implements OnInit {
  private readonly quotesService = inject(QuotesService);
  private readonly notificationService = inject(NotificationService);

  quotes: Quote[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loading = true;
    this.quotesService.getQuotes().subscribe({
      next: response => {
        this.quotes = response.content;
        this.loading = false;
      },
      error: error => {
        this.notificationService.showError('Error al cargar cotizaciones');
        console.error(error);
        this.loading = false;
      },
    });
  }
}
