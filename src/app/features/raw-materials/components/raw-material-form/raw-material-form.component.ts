import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { RawMaterialsService } from '../../../../core/services/raw-materials.service';
import {
  RawMaterial,
  RawMaterialCategory,
  MeasurementUnit,
  Allergen,
  CreateRawMaterialRequest,
  UpdateRawMaterialRequest,
} from '../../../../shared/models';

@Component({
  selector: 'app-raw-material-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    TranslateModule,
  ],
  templateUrl: './raw-material-form.component.html',
  styleUrls: ['./raw-material-form.component.scss'],
})
export class RawMaterialFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly rawMaterialsService = inject(RawMaterialsService);
  private readonly toastr = inject(ToastrService);

  form!: FormGroup;
  loading = false;
  isEditMode = false;
  materialId?: number;

  categories: RawMaterialCategory[] = [];
  units: MeasurementUnit[] = [];
  allergens: Allergen[] = [];

  ngOnInit(): void {
    this.loadFormData();
    this.buildForm();
    this.checkEditMode();
  }

  loadFormData(): void {
    // Load categories
    this.rawMaterialsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('Error al cargar categorías');
      },
    });

    // Load units
    this.rawMaterialsService.getUnits().subscribe({
      next: (units) => {
        this.units = units;
      },
      error: (error) => {
        console.error('Error loading units:', error);
        this.toastr.error('Error al cargar unidades');
      },
    });

    // Load allergens
    this.rawMaterialsService.getAllergens().subscribe({
      next: (allergens) => {
        this.allergens = allergens;
      },
      error: (error) => {
        console.error('Error loading allergens:', error);
        this.toastr.error('Error al cargar alérgenos');
      },
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      brand: ['', [Validators.required, Validators.maxLength(100)]],
      supplier: ['', [Validators.required, Validators.maxLength(100)]],
      categoryId: [null, [Validators.required]],
      purchaseUnitId: [null, [Validators.required]],
      purchaseQuantity: [null, [Validators.required, Validators.min(0.01)]],
      unitCost: [null, [Validators.required, Validators.min(0)]],
      currency: ['MXN', [Validators.maxLength(3)]],
      minimumStock: [0, [Validators.min(0)]],
      allergenIds: [[]],
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.materialId = parseInt(id, 10);
      this.loadMaterial();
    }
  }

  loadMaterial(): void {
    if (!this.materialId) return;

    this.loading = true;
    this.rawMaterialsService.getRawMaterialById(this.materialId).subscribe({
      next: (material) => {
        this.form.patchValue({
          name: material.name,
          description: material.description,
          brand: material.brand,
          supplier: material.supplier,
          categoryId: material.category.id,
          purchaseUnitId: material.purchaseUnit.id,
          purchaseQuantity: material.purchaseQuantity,
          unitCost: material.unitCost,
          currency: material.currency,
          minimumStock: material.minimumStock,
          allergenIds: material.allergens.map((a) => a.id),
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading material:', error);
        this.toastr.error('Error al cargar materia prima');
        this.loading = false;
        this.router.navigate(['/raw-materials']);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      this.updateMaterial();
    } else {
      this.createMaterial();
    }
  }

  createMaterial(): void {
    const request: CreateRawMaterialRequest = {
      name: this.form.value.name.trim(),
      description: this.form.value.description?.trim() || undefined,
      brand: this.form.value.brand.trim(),
      supplier: this.form.value.supplier.trim(),
      categoryId: this.form.value.categoryId,
      purchaseUnitId: this.form.value.purchaseUnitId,
      purchaseQuantity: this.form.value.purchaseQuantity,
      unitCost: this.form.value.unitCost,
      currency: this.form.value.currency || 'MXN',
      minimumStock: this.form.value.minimumStock || 0,
      allergenIds: this.form.value.allergenIds || [],
    };

    this.rawMaterialsService.createRawMaterial(request).subscribe({
      next: () => {
        this.toastr.success('Materia prima creada exitosamente');
        this.router.navigate(['/raw-materials']);
      },
      error: (error) => {
        console.error('Error creating material:', error);
        this.toastr.error('Error al crear materia prima');
        this.loading = false;
      },
    });
  }

  updateMaterial(): void {
    if (!this.materialId) return;

    const request: UpdateRawMaterialRequest = {
      name: this.form.value.name.trim(),
      description: this.form.value.description?.trim() || undefined,
      brand: this.form.value.brand.trim(),
      supplier: this.form.value.supplier.trim(),
      categoryId: this.form.value.categoryId,
      purchaseUnitId: this.form.value.purchaseUnitId,
      purchaseQuantity: this.form.value.purchaseQuantity,
      unitCost: this.form.value.unitCost,
      currency: this.form.value.currency || 'MXN',
      minimumStock: this.form.value.minimumStock || 0,
      allergenIds: this.form.value.allergenIds || [],
    };

    this.rawMaterialsService.updateRawMaterial(this.materialId, request).subscribe({
      next: () => {
        this.toastr.success('Materia prima actualizada exitosamente');
        this.router.navigate(['/raw-materials']);
      },
      error: (error) => {
        console.error('Error updating material:', error);
        this.toastr.error('Error al actualizar materia prima');
        this.loading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/raw-materials']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['maxlength']) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    if (control.errors['min']) {
      const min = control.errors['min'].min;
      return `El valor mínimo es ${min}`;
    }

    return '';
  }
}
