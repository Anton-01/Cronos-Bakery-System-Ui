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
import { ApiResponse } from '../../shared/models/api-response.model';
import { extractData } from '../../shared/operators/api-response.operator';

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

    return this.http.get<ApiResponse<PageResponse<Recipe>>>(this.apiUrl, { params })
      .pipe(extractData());
  }

  /**
   * Get recipe by ID
   */
  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<ApiResponse<Recipe>>(`${this.apiUrl}/${id}`)
      .pipe(extractData());
  }

  /**
   * Create new recipe
   */
  createRecipe(request: CreateRecipeRequest): Observable<Recipe> {
    return this.http.post<ApiResponse<Recipe>>(this.apiUrl, request)
      .pipe(extractData());
  }

  /**
   * Update existing recipe
   */
  updateRecipe(id: number, request: UpdateRecipeRequest): Observable<Recipe> {
    return this.http.put<ApiResponse<Recipe>>(`${this.apiUrl}/${id}`, request)
      .pipe(extractData());
  }

  /**
   * Delete recipe (soft delete)
   */
  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(extractData());
  }

  /**
   * Restore deleted recipe
   */
  restoreRecipe(id: number): Observable<Recipe> {
    return this.http.put<ApiResponse<Recipe>>(`${this.apiUrl}/${id}/restore`, {})
      .pipe(extractData());
  }

  /**
   * Duplicate recipe
   */
  duplicateRecipe(id: number, newName: string): Observable<Recipe> {
    return this.http.post<ApiResponse<Recipe>>(`${this.apiUrl}/${id}/duplicate`, { name: newName })
      .pipe(extractData());
  }

  /**
   * Create new version of recipe
   */
  createVersion(id: number, versionNotes?: string): Observable<Recipe> {
    return this.http.post<ApiResponse<Recipe>>(`${this.apiUrl}/${id}/version`, { versionNotes })
      .pipe(extractData());
  }

  /**
   * Get recipe versions
   */
  getRecipeVersions(id: number): Observable<Recipe[]> {
    return this.http.get<ApiResponse<Recipe[]>>(`${this.apiUrl}/${id}/versions`)
      .pipe(extractData());
  }

  // ==================== Recipe Cost Calculations ====================

  /**
   * Calculate recipe cost
   */
  calculateRecipeCost(id: number): Observable<RecipeCostBreakdown> {
    return this.http.get<ApiResponse<RecipeCostBreakdown>>(`${this.apiUrl}/${id}/cost`)
      .pipe(extractData());
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
    return this.http.post<ApiResponse<RecipeCostBreakdown>>(`${this.apiUrl}/calculate-cost`, request)
      .pipe(extractData());
  }

  /**
   * Get recipe cost per unit
   */
  getCostPerUnit(id: number, targetUnitId?: number): Observable<number> {
    let params = new HttpParams();
    if (targetUnitId !== undefined) {
      params = params.set('targetUnitId', targetUnitId.toString());
    }
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/${id}/cost-per-unit`, { params })
      .pipe(extractData());
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
    return this.http.post<ApiResponse<{
      scaledIngredients: RecipeIngredient[];
      scaleFactor: number;
      originalYield: number;
      targetYield: number;
    }>>(`${this.apiUrl}/${id}/scale`, {
      targetYield,
      targetUnitId,
    }).pipe(extractData());
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
    return this.http.get<ApiResponse<Recipe[]>>(`${this.apiUrl}/search/by-ingredients`, { params })
      .pipe(extractData());
  }

  /**
   * Get recipes containing specific allergen
   */
  getRecipesByAllergen(allergenId: number): Observable<Recipe[]> {
    return this.http.get<ApiResponse<Recipe[]>>(`${this.apiUrl}/search/by-allergen/${allergenId}`)
      .pipe(extractData());
  }

  /**
   * Get popular recipes
   */
  getPopularRecipes(limit: number = 10): Observable<Recipe[]> {
    return this.http.get<ApiResponse<Recipe[]>>(`${this.apiUrl}/popular`, {
      params: new HttpParams().set('limit', limit.toString()),
    }).pipe(extractData());
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
    return this.http.get<ApiResponse<{
      totalRecipes: number;
      activeRecipes: number;
      inactiveRecipes: number;
      averageCost: number;
      mostExpensiveRecipe: Recipe | null;
      cheapestRecipe: Recipe | null;
      totalVersions: number;
    }>>(`${this.apiUrl}/statistics`).pipe(extractData());
  }

  // ==================== Batch Operations ====================

  /**
   * Batch update recipe prices
   */
  batchUpdatePrices(updates: Array<{ recipeId: number; newPrice: number }>): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/batch/prices`, { updates })
      .pipe(extractData());
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
