import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { RecipesService } from '../../../../core/services/recipes.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Recipe } from '../../../../shared/models/recipe.model';

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  template: `
    <div class="recipes-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <div class="header">
              <h1>Recetas</h1>
              <button mat-raised-button color="primary" routerLink="/recipes/create">
                <mat-icon>add</mat-icon>
                Nueva Receta
              </button>
            </div>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (loading) {
            <p>Cargando recetas...</p>
          } @else {
            <p>Total de recetas: {{ recipes.length }}</p>
            <!-- TODO: Implementar tabla de recetas -->
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .recipes-container {
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
export class RecipesListComponent implements OnInit {
  private readonly recipesService = inject(RecipesService);
  private readonly notificationService = inject(NotificationService);

  recipes: Recipe[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.loading = true;
    this.recipesService.getRecipes().subscribe({
      next: response => {
        this.recipes = response.content;
        this.loading = false;
      },
      error: error => {
        this.notificationService.showError('Error al cargar recetas');
        console.error(error);
        this.loading = false;
      },
    });
  }
}
