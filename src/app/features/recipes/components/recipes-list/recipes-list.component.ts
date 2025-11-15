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
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { RecipesService } from '../../../../core/services/recipes.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Recipe } from '../../../../shared/models';

@Component({
  selector: 'app-recipes-list',
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
    TranslateModule,
  ],
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
})
export class RecipesListComponent implements OnInit {
  private readonly recipesService = inject(RecipesService);
  private readonly notificationService = inject(NotificationService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'name',
    'yieldQuantity',
    'totalCost',
    'preparationTime',
    'status',
    'isActive',
    'actions',
  ];

  dataSource = new MatTableDataSource<Recipe>([]);

  loading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filterForm = new FormGroup({
    name: new FormControl(''),
  });

  ngOnInit(): void {
    this.loadRecipes();
    this.setupFilters();
  }

  setupFilters(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadRecipes();
      });
  }

  loadRecipes(): void {
    this.loading = true;

    const filters = {
      name: this.filterForm.value.name || undefined,
    };

    const sort = this.sort?.active
      ? `${this.sort.active},${this.sort.direction}`
      : 'name,asc';

    this.recipesService.getRecipes(this.pageIndex, this.pageSize, sort, filters).subscribe({
      next: response => {
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: error => {
        this.notificationService.showError('Error al cargar recetas');
        console.error('Error loading recipes:', error);
        this.loading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRecipes();
  }

  onSortChange(sort: Sort): void {
    this.loadRecipes();
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  editRecipe(recipe: Recipe): void {
    window.location.href = `/recipes/edit/${recipe.id}`;
  }

  viewDetails(recipe: Recipe): void {
    console.log('View details:', recipe);
  }

  duplicateRecipe(recipe: Recipe): void {
    const newName = prompt('Ingrese el nombre para la receta duplicada:', `${recipe.name} (Copia)`);
    if (newName) {
      this.recipesService.duplicateRecipe(recipe.id, newName).subscribe({
        next: () => {
          this.notificationService.showSuccess('Receta duplicada correctamente');
          this.loadRecipes();
        },
        error: error => {
          this.notificationService.showError('Error al duplicar receta');
          console.error('Error duplicating recipe:', error);
        },
      });
    }
  }

  deleteRecipe(recipe: Recipe): void {
    if (confirm(`¿Está seguro de que desea eliminar "${recipe.name}"?`)) {
      this.recipesService.deleteRecipe(recipe.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Receta eliminada correctamente');
          this.loadRecipes();
        },
        error: error => {
          this.notificationService.showError('Error al eliminar receta');
          console.error('Error deleting recipe:', error);
        },
      });
    }
  }

  restoreRecipe(recipe: Recipe): void {
    this.recipesService.restoreRecipe(recipe.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Receta restaurada correctamente');
        this.loadRecipes();
      },
      error: error => {
        this.notificationService.showError('Error al restaurar receta');
        console.error('Error restoring recipe:', error);
      },
    });
  }

  getTotalTime(recipe: Recipe): number {
    return (
      (recipe.preparationTimeMinutes || 0) +
      (recipe.bakingTimeMinutes || 0) +
      (recipe.coolingTimeMinutes || 0)
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PUBLISHED':
        return 'primary';
      case 'DRAFT':
        return 'accent';
      case 'ARCHIVED':
        return 'warn';
      default:
        return '';
    }
  }
}
