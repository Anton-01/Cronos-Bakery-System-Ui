import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { RawMaterialsService } from '../../../../core/services/raw-materials.service';
import { RawMaterialCategory, CreateCategoryRequest, UpdateCategoryRequest } from '../../../../shared/models';

interface CategoryFormDialogData {
  category: RawMaterialCategory | null;
}

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './category-form-dialog.component.html',
  styleUrls: ['./category-form-dialog.component.scss'],
})
export class CategoryFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CategoryFormDialogComponent>);
  private readonly data = inject<CategoryFormDialogData>(MAT_DIALOG_DATA);
  private readonly rawMaterialsService = inject(RawMaterialsService);
  private readonly toastr = inject(ToastrService);

  form!: FormGroup;
  loading = false;
  isEditMode = false;

  ngOnInit(): void {
    this.isEditMode = !!this.data.category;
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: [
        this.data.category?.name || '',
        [Validators.required, Validators.maxLength(100)],
      ],
      description: [
        this.data.category?.description || '',
        [Validators.maxLength(500)],
      ],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.data.category) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  createCategory(): void {
    const request: CreateCategoryRequest = {
      name: this.form.value.name.trim(),
      description: this.form.value.description?.trim() || undefined,
    };

    this.rawMaterialsService.createCategory(request).subscribe({
      next: () => {
        this.toastr.success('Categoría creada exitosamente');
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error creating category:', error);
        this.toastr.error('Error al crear categoría');
        this.loading = false;
      },
    });
  }

  updateCategory(): void {
    if (!this.data.category) return;

    const request: UpdateCategoryRequest = {
      name: this.form.value.name.trim(),
      description: this.form.value.description?.trim() || undefined,
    };

    this.rawMaterialsService.updateCategory(this.data.category.id, request).subscribe({
      next: () => {
        this.toastr.success('Categoría actualizada exitosamente');
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error updating category:', error);
        this.toastr.error('Error al actualizar categoría');
        this.loading = false;
      },
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }

    return '';
  }
}
