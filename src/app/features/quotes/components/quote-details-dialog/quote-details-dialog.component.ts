import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { Quote, QuoteStatus } from '../../../../shared/models';

@Component({
  selector: 'app-quote-details-dialog',
  standalone: true,
  imports: [ CommonModule, RouterModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule, MatTableModule,],
  templateUrl: './quote-details-dialog.component.html',
  styleUrl: './quote-details-dialog.component.scss',
})
export class QuoteDetailsDialogComponent {
  dialogRef = inject<MatDialogRef<QuoteDetailsDialogComponent>>(MatDialogRef);
  quote = inject<Quote>(MAT_DIALOG_DATA);

  displayedColumns: string[] = ['recipe', 'quantity', 'unitPrice', 'subtotal'];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getStatusColor(): string {
    switch (this.quote.status) {
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

  getStatusLabel(): string {
    switch (this.quote.status) {
      case QuoteStatus.DRAFT:
        return 'Borrador';
      case QuoteStatus.SENT:
        return 'Enviada';
      case QuoteStatus.ACCEPTED:
        return 'Aceptada';
      case QuoteStatus.REJECTED:
        return 'Rechazada';
      case QuoteStatus.EXPIRED:
        return 'Expirada';
      default:
        return '';
    }
  }

  isExpiringSoon(): boolean {
    const validDate = new Date(this.quote.validUntil);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((validDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
  }

  close(): void {
    this.dialogRef.close();
  }
}
