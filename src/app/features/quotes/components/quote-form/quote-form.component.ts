import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

import { QuotesService } from '../../../../core/services/quotes.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CreateQuoteRequest, UpdateQuoteRequest, QuoteStatus } from '../../../../shared/models/quote.model';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    TranslateModule,
  ],
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.scss'],
})
export class QuoteFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly quotesService = inject(QuotesService);
  private readonly notificationService = inject(NotificationService);

  form!: FormGroup;
  loading = false;
  isEditMode = false;
  quoteId?: number;

  quoteStatuses = [
    { value: QuoteStatus.DRAFT, label: 'quotes.statusDraft' },
    { value: QuoteStatus.SENT, label: 'quotes.statusSent' },
    { value: QuoteStatus.ACCEPTED, label: 'quotes.statusAccepted' },
    { value: QuoteStatus.REJECTED, label: 'quotes.statusRejected' },
    { value: QuoteStatus.EXPIRED, label: 'quotes.statusExpired' },
  ];

  ngOnInit(): void {
    this.buildForm();
    this.checkEditMode();
  }

  buildForm(): void {
    this.form = this.fb.group({
      clientName: ['', [Validators.required, Validators.maxLength(100)]],
      clientEmail: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      clientPhone: ['', [Validators.maxLength(20)]],
      clientAddress: ['', [Validators.maxLength(500)]],
      notes: ['', [Validators.maxLength(2000)]],
      validityDays: [30, [Validators.required, Validators.min(1), Validators.max(365)]],
      status: [QuoteStatus.DRAFT],
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.quoteId = +id;
      this.loadQuote(this.quoteId);
    }
  }

  loadQuote(id: number): void {
    this.loading = true;
    this.quotesService.getQuoteById(id).subscribe({
      next: quote => {
        const validUntil = new Date(quote.validUntil);
        const createdAt = new Date(quote.createdAt);
        const validityDays = Math.ceil((validUntil.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

        this.form.patchValue({
          clientName: quote.clientName,
          clientEmail: quote.clientEmail,
          clientPhone: quote.clientPhone || '',
          clientAddress: quote.clientAddress || '',
          notes: quote.notes || '',
          validityDays: validityDays,
          status: quote.status,
        });
        this.loading = false;
      },
      error: error => {
        this.notificationService.showError('Error al cargar cotización');
        console.error('Error loading quote:', error);
        this.loading = false;
        this.cancel();
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.quoteId) {
      this.updateQuote();
    } else {
      this.createQuote();
    }
  }

  createQuote(): void {
    const request: CreateQuoteRequest = {
      clientName: this.form.value.clientName,
      clientEmail: this.form.value.clientEmail,
      clientPhone: this.form.value.clientPhone || undefined,
      clientAddress: this.form.value.clientAddress || undefined,
      notes: this.form.value.notes || undefined,
      validityDays: this.form.value.validityDays,
      items: [], // Empty items array for initial creation
    };

    this.quotesService.createQuote(request).subscribe({
      next: quote => {
        this.notificationService.showSuccess('Cotización creada correctamente');
        this.loading = false;
        this.router.navigate(['/quotes/edit', quote.id]);
      },
      error: error => {
        this.notificationService.showError('Error al crear cotización');
        console.error('Error creating quote:', error);
        this.loading = false;
      },
    });
  }

  updateQuote(): void {
    const request: UpdateQuoteRequest = {
      clientName: this.form.value.clientName,
      clientEmail: this.form.value.clientEmail,
      clientPhone: this.form.value.clientPhone || undefined,
      clientAddress: this.form.value.clientAddress || undefined,
      notes: this.form.value.notes || undefined,
      validityDays: this.form.value.validityDays,
      status: this.form.value.status,
    };

    this.quotesService.updateQuote(this.quoteId!, request).subscribe({
      next: () => {
        this.notificationService.showSuccess('Cotización actualizada correctamente');
        this.loading = false;
        this.router.navigate(['/quotes']);
      },
      error: error => {
        this.notificationService.showError('Error al actualizar cotización');
        console.error('Error updating quote:', error);
        this.loading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/quotes']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control.hasError('email')) {
      return 'Email inválido';
    }

    if (control.hasError('maxLength')) {
      const maxLength = control.getError('maxLength').requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }

    if (control.hasError('min')) {
      const min = control.getError('min').min;
      return `Mínimo ${min}`;
    }

    if (control.hasError('max')) {
      const max = control.getError('max').max;
      return `Máximo ${max}`;
    }

    return '';
  }
}
