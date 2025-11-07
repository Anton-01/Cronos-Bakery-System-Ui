import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Recipe,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  RecipeIngredient,
  RecipeCostBreakdown,
} from '../../shared/models/recipe.model';
import { PageResponse } from '../../shared/models/common.model';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/recipes`;

  // ==================== Recipes ====================

  /**
   * Get paginated list of recipes with optional filters
   */
  getRecipes(
    page: number = 0,
    size: number = 10,
    sort?: string,
    filters?: {
      name?: string;
      categoryId?: number;
      isActive?: boolean;
      minYield?: number;
      maxYield?: number;
    }
  ): Observable<PageResponse<Recipe>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    if (filters?.name) {
      params = params.set('name', filters.name);
    }

    if (filters?.categoryId !== undefined) {
      params = params.set('categoryId', filters.categoryId.toString());
    }

    if (filters?.isActive !== undefined) {
      params = params.set('isActive', filters.isActive.toString());
    }

    if (filters?.minYield !== undefined) {
      params = params.set('minYield', filters.minYield.toString());
    }

    if (filters?.maxYield !== undefined) {
      params = params.set('maxYield', filters.maxYield.toString());
    }

    return this.http.get<PageResponse<Recipe>>(this.apiUrl, { params });
  }

  /**
   * Get recipe by ID
   */
  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new recipe
   */
  createRecipe(request: CreateRecipeRequest): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, request);
  }

  /**
   * Update existing recipe
   */
  updateRecipe(id: number, request: UpdateRecipeRequest): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete recipe (soft delete)
   */
  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Restore deleted recipe
   */
  restoreRecipe(id: number): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}/restore`, {});
  }

  /**
   * Duplicate recipe
   */
  duplicateRecipe(id: number, newName: string): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/${id}/duplicate`, { name: newName });
  }

  /**
   * Create new version of recipe
   */
  createVersion(id: number, versionNotes?: string): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/${id}/version`, { versionNotes });
  }

  /**
   * Get recipe versions
   */
  getRecipeVersions(id: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/${id}/versions`);
  }

  // ==================== Recipe Cost Calculations ====================

  /**
   * Calculate recipe cost
   */
  calculateRecipeCost(id: number): Observable<RecipeCostBreakdown> {
    return this.http.get<RecipeCostBreakdown>(`${this.apiUrl}/${id}/cost`);
  }

  /**
   * Calculate cost for custom recipe configuration
   */
  calculateCustomCost(request: {
    ingredients: RecipeIngredient[];
    subRecipes?: Array<{ recipeId: number; quantity: number; unitId: number }>;
    fixedCosts?: Array<{ name: string; amount: number }>;
    yieldQuantity: number;
    yieldUnitId: number;
  }): Observable<RecipeCostBreakdown> {
    return this.http.post<RecipeCostBreakdown>(`${this.apiUrl}/calculate-cost`, request);
  }

  /**
   * Get recipe cost per unit
   */
  getCostPerUnit(id: number, targetUnitId?: number): Observable<number> {
    let params = new HttpParams();
    if (targetUnitId !== undefined) {
      params = params.set('targetUnitId', targetUnitId.toString());
    }
    return this.http.get<number>(`${this.apiUrl}/${id}/cost-per-unit`, { params });
  }

  // ==================== Recipe Scaling ====================

  /**
   * Scale recipe to desired yield
   */
  scaleRecipe(
    id: number,
    targetYield: number,
    targetUnitId: number
  ): Observable<{
    scaledIngredients: RecipeIngredient[];
    scaleFactor: number;
    originalYield: number;
    targetYield: number;
  }> {
    return this.http.post<{
      scaledIngredients: RecipeIngredient[];
      scaleFactor: number;
      originalYield: number;
      targetYield: number;
    }>(`${this.apiUrl}/${id}/scale`, {
      targetYield,
      targetUnitId,
    });
  }

  // ==================== Recipe Search & Filters ====================

  /**
   * Search recipes by ingredients
   */
  searchByIngredients(rawMaterialIds: number[]): Observable<Recipe[]> {
    let params = new HttpParams();
    rawMaterialIds.forEach(id => {
      params = params.append('rawMaterialIds', id.toString());
    });
    return this.http.get<Recipe[]>(`${this.apiUrl}/search/by-ingredients`, { params });
  }

  /**
   * Get recipes containing specific allergen
   */
  getRecipesByAllergen(allergenId: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/search/by-allergen/${allergenId}`);
  }

  /**
   * Get popular recipes
   */
  getPopularRecipes(limit: number = 10): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/popular`, {
      params: new HttpParams().set('limit', limit.toString()),
    });
  }

  // ==================== Statistics ====================

  /**
   * Get recipes statistics
   */
  getStatistics(): Observable<{
    totalRecipes: number;
    activeRecipes: number;
    inactiveRecipes: number;
    averageCost: number;
    mostExpensiveRecipe: Recipe | null;
    cheapestRecipe: Recipe | null;
    totalVersions: number;
  }> {
    return this.http.get<{
      totalRecipes: number;
      activeRecipes: number;
      inactiveRecipes: number;
      averageCost: number;
      mostExpensiveRecipe: Recipe | null;
      cheapestRecipe: Recipe | null;
      totalVersions: number;
    }>(`${this.apiUrl}/statistics`);
  }

  // ==================== Batch Operations ====================

  /**
   * Batch update recipe prices
   */
  batchUpdatePrices(updates: Array<{ recipeId: number; newPrice: number }>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/batch/prices`, { updates });
  }

  /**
   * Export recipe to PDF
   */
  exportToPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/export/pdf`, {
      responseType: 'blob',
    });
  }

  /**
   * Export recipe to Excel
   */
  exportToExcel(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/export/excel`, {
      responseType: 'blob',
    });
  }
}
