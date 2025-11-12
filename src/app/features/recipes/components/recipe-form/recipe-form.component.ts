import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { RecipesService } from '../../../../core/services/recipes.service';
import {
  Recipe,
  CreateRecipeRequest,
  UpdateRecipeRequest,
} from '../../../../shared/models/recipe.model';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],
})
export class RecipeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly recipesService = inject(RecipesService);
  private readonly toastr = inject(ToastrService);

  form!: FormGroup;
  loading = false;
  isEditMode = false;
  recipeId?: number;

  ngOnInit(): void {
    this.buildForm();
    this.checkEditMode();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      yieldQuantity: [null, [Validators.required, Validators.min(0.01)]],
      yieldUnit: ['', [Validators.required, Validators.maxLength(50)]],
      preparationTimeMinutes: [0, [Validators.min(0)]],
      bakingTimeMinutes: [0, [Validators.min(0)]],
      coolingTimeMinutes: [0, [Validators.min(0)]],
      instructions: ['', [Validators.maxLength(5000)]],
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.recipeId = parseInt(id, 10);
      this.loadRecipe();
    }
  }

  loadRecipe(): void {
    if (!this.recipeId) return;

    this.loading = true;
    this.recipesService.getRecipeById(this.recipeId).subscribe({
      next: (recipe) => {
        this.form.patchValue({
          name: recipe.name,
          description: recipe.description,
          yieldQuantity: recipe.yieldQuantity,
          yieldUnit: recipe.yieldUnit,
          preparationTimeMinutes: recipe.preparationTimeMinutes,
          bakingTimeMinutes: recipe.bakingTimeMinutes,
          coolingTimeMinutes: recipe.coolingTimeMinutes,
          instructions: recipe.instructions,
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recipe:', error);
        this.toastr.error('Error al cargar receta');
        this.loading = false;
        this.router.navigate(['/recipes']);
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
      this.updateRecipe();
    } else {
      this.createRecipe();
    }
  }

  createRecipe(): void {
    const request: CreateRecipeRequest = {
      name: this.form.value.name.trim(),
      description: this.form.value.description?.trim() || undefined,
      yieldQuantity: this.form.value.yieldQuantity,
      yieldUnit: this.form.value.yieldUnit.trim(),
      preparationTimeMinutes: this.form.value.preparationTimeMinutes || 0,
      bakingTimeMinutes: this.form.value.bakingTimeMinutes || 0,
      coolingTimeMinutes: this.form.value.coolingTimeMinutes || 0,
      instructions: this.form.value.instructions?.trim() || undefined,
      ingredients: [], // Empty for now - can be added in future enhancement
    };

    this.recipesService.createRecipe(request).subscribe({
      next: () => {
        this.toastr.success('Receta creada exitosamente');
        this.router.navigate(['/recipes']);
      },
      error: (error) => {
        console.error('Error creating recipe:', error);
        this.toastr.error('Error al crear receta');
        this.loading = false;
      },
    });
  }

  updateRecipe(): void {
    if (!this.recipeId) return;

    const request: UpdateRecipeRequest = {
      name: this.form.value.name.trim(),
      description: this.form.value.description?.trim() || undefined,
      yieldQuantity: this.form.value.yieldQuantity,
      yieldUnit: this.form.value.yieldUnit.trim(),
      preparationTimeMinutes: this.form.value.preparationTimeMinutes || 0,
      bakingTimeMinutes: this.form.value.bakingTimeMinutes || 0,
      coolingTimeMinutes: this.form.value.coolingTimeMinutes || 0,
      instructions: this.form.value.instructions?.trim() || undefined,
    };

    this.recipesService.updateRecipe(this.recipeId, request).subscribe({
      next: () => {
        this.toastr.success('Receta actualizada exitosamente');
        this.router.navigate(['/recipes']);
      },
      error: (error) => {
        console.error('Error updating recipe:', error);
        this.toastr.error('Error al actualizar receta');
        this.loading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/recipes']);
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
