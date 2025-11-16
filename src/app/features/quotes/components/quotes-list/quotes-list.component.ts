import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { QuotesService } from '../../../../core/services/quotes.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Quote, QuoteStatus } from '../../../../shared/models';

@Component({
  selector: 'app-quotes-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatSelectModule,
    MatDividerModule,
    MatDialogModule,
    TranslateModule,
  ],
  templateUrl: './quotes-list.component.html',
  styleUrls: ['./quotes-list.component.scss'],
})
export class QuotesListComponent implements OnInit {
  private readonly quotesService = inject(QuotesService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'quoteNumber',
    'clientName',
    'total',
    'itemsCount',
    'validUntil',
    'status',
    'createdAt',
    'actions',
  ];

  dataSource = new MatTableDataSource<Quote>([]);

  loading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filterForm = new FormGroup({
    clientName: new FormControl(''),
    status: new FormControl<QuoteStatus | null>(null),
  });

  ngOnInit(): void {
    this.loadQuotes();
    this.setupFilters();
  }

  setupFilters(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadQuotes();
      });
  }

  loadQuotes(): void {
    this.loading = true;

    const filters = {
      clientName: this.filterForm.value.clientName || undefined,
      status: this.filterForm.value.status || undefined,
    };

    const sort = this.sort?.active
      ? `${this.sort.active},${this.sort.direction}`
      : 'createdAt,desc';

    this.quotesService.getQuotes(this.pageIndex, this.pageSize, sort, filters).subscribe({
      next: response => {
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: error => {
        this.notificationService.showError('Error al cargar cotizaciones');
        console.error('Error loading quotes:', error);
        this.loading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadQuotes();
  }

  onSortChange(_sort: Sort): void {
    // Sort is handled by MatSort directive
    this.loadQuotes();
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  viewQuote(quote: Quote): void {
    import('../quote-details-dialog/quote-details-dialog.component').then(
      (m) => {
        this.dialog.open(m.QuoteDetailsDialogComponent, {
          width: '900px',
          maxHeight: '90vh',
          data: quote,
        });
      }
    );
  }

  editQuote(quote: Quote): void {
    window.location.href = `/quotes/edit/${quote.id}`;
  }

  duplicateQuote(quote: Quote): void {
    if (confirm(`¿Desea duplicar la cotización "${quote.quoteNumber}"?`)) {
      this.quotesService.duplicateQuote(quote.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Cotización duplicada correctamente');
          this.loadQuotes();
        },
        error: error => {
          this.notificationService.showError('Error al duplicar cotización');
          console.error('Error duplicating quote:', error);
        },
      });
    }
  }

  deleteQuote(quote: Quote): void {
    if (confirm(`¿Está seguro de que desea eliminar la cotización "${quote.quoteNumber}"?`)) {
      this.quotesService.deleteQuote(quote.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Cotización eliminada correctamente');
          this.loadQuotes();
        },
        error: error => {
          this.notificationService.showError('Error al eliminar cotización');
          console.error('Error deleting quote:', error);
        },
      });
    }
  }

  downloadPdf(quote: Quote): void {
    this.quotesService.downloadPdf(quote.id, `cotizacion-${quote.quoteNumber}.pdf`);
    this.notificationService.showSuccess('Descargando PDF...');
  }

  copyShareLink(quote: Quote): void {
    if (quote.shareToken) {
      const shareUrl = `${window.location.origin}/quotes/public/${quote.shareToken}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.notificationService.showSuccess('Enlace copiado al portapapeles');
      }).catch(() => {
        this.notificationService.showError('Error al copiar enlace');
      });
    } else {
      this.quotesService.generatePublicLink(quote.id).subscribe({
        next: response => {
          navigator.clipboard.writeText(response.publicUrl).then(() => {
            this.notificationService.showSuccess('Enlace generado y copiado al portapapeles');
            this.loadQuotes();
          });
        },
        error: error => {
          this.notificationService.showError('Error al generar enlace público');
          console.error('Error generating public link:', error);
        },
      });
    }
  }

  markAsSent(quote: Quote): void {
    this.quotesService.markAsSent(quote.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cotización marcada como enviada');
        this.loadQuotes();
      },
      error: error => {
        this.notificationService.showError('Error al actualizar estado');
        console.error('Error updating status:', error);
      },
    });
  }

  markAsAccepted(quote: Quote): void {
    this.quotesService.markAsAccepted(quote.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cotización marcada como aceptada');
        this.loadQuotes();
      },
      error: error => {
        this.notificationService.showError('Error al actualizar estado');
        console.error('Error updating status:', error);
      },
    });
  }

  markAsRejected(quote: Quote): void {
    this.quotesService.markAsRejected(quote.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cotización marcada como rechazada');
        this.loadQuotes();
      },
      error: error => {
        this.notificationService.showError('Error al actualizar estado');
        console.error('Error updating status:', error);
      },
    });
  }

  isExpiringSoon(validUntil: string): boolean {
    const validDate = new Date(validUntil);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((validDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
  }

  getStatusColor(status: QuoteStatus): string {
    switch (status) {
      case QuoteStatus.DRAFT:
        return '';
      case QuoteStatus.SENT:
        return 'primary';
      case QuoteStatus.ACCEPTED:
        return 'primary';
      case QuoteStatus.REJECTED:
        return 'warn';
      case QuoteStatus.EXPIRED:
        return 'warn';
      default:
        return '';
    }
  }

  getStatusLabel(status: QuoteStatus): string {
    switch (status) {
      case QuoteStatus.DRAFT:
        return 'quotes.statusDraft';
      case QuoteStatus.SENT:
        return 'quotes.statusSent';
      case QuoteStatus.ACCEPTED:
        return 'quotes.statusAccepted';
      case QuoteStatus.REJECTED:
        return 'quotes.statusRejected';
      case QuoteStatus.EXPIRED:
        return 'quotes.statusExpired';
      default:
        return '';
    }
  }
}
