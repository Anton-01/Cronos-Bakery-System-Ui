import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RawMaterial,
  CreateRawMaterialRequest,
  UpdateRawMaterialRequest,
  RawMaterialCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  MeasurementUnit,
  CreateUnitRequest,
  UpdateUnitRequest,
  UnitConversion,
  CreateConversionRequest,
  Allergen,
  ApiResponse
} from '../../shared/models';
import { PageResponse } from '../../shared/models/common.model';
import { extractData } from '../../shared/operators/api-response.operator';

@Injectable({
  providedIn: 'root',
})
export class RawMaterialsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/raw-materials`;

  // ==================== Raw Materials ====================

  /**
   * Get paginated list of raw materials with optional filters
   */
  getRawMaterials(page: number = 0, size: number = 10, sort?: string, filters?: {
      name?: string; categoryId?: number; isActive?: boolean; allergenIds?: number[];
    }
    ): Observable<PageResponse<RawMaterial>> {
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

    if (filters?.allergenIds && filters.allergenIds.length > 0) {
      filters.allergenIds.forEach(id => {
        params = params.append('allergenIds', id.toString());
      });
    }

    return this.http.get<ApiResponse<PageResponse<RawMaterial>>>(this.apiUrl, { params })
      .pipe(extractData());
  }

  /**
   * Get raw material by ID
   */
  getRawMaterialById(id: number): Observable<RawMaterial> {
    return this.http.get<ApiResponse<RawMaterial>>(`${this.apiUrl}/${id}`)
      .pipe(extractData());
  }

  /**
   * Create new raw material
   */
  createRawMaterial(request: CreateRawMaterialRequest): Observable<RawMaterial> {
    return this.http.post<ApiResponse<RawMaterial>>(this.apiUrl, request)
      .pipe(extractData());
  }

  /**
   * Update existing raw material
   */
  updateRawMaterial(id: number, request: UpdateRawMaterialRequest): Observable<RawMaterial> {
    return this.http.put<ApiResponse<RawMaterial>>(`${this.apiUrl}/${id}`, request)
      .pipe(extractData());
  }

  /**
   * Delete raw material (soft delete)
   */
  deleteRawMaterial(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(extractData());
  }

  /**
   * Restore deleted raw material
   */
  restoreRawMaterial(id: number): Observable<RawMaterial> {
    return this.http.put<ApiResponse<RawMaterial>>(`${this.apiUrl}/${id}/restore`, {})
      .pipe(extractData());
  }

  /**
   * Get low stock raw materials
   */
  getLowStockRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<ApiResponse<RawMaterial[]>>(`${this.apiUrl}/low-stock`)
      .pipe(extractData());
  }

  // ==================== Categories ====================

  /**
   * Get all categories
   */
  getCategories(): Observable<RawMaterialCategory[]> {
    return this.http.get<ApiResponse<RawMaterialCategory[]>>(`${environment.apiUrl}/categories`)
      .pipe(extractData());
  }

  /**
   * Get paginated categories
   */
  getCategoriesPaginated(page: number = 0, size: number = 10, sort?: string): Observable<PageResponse<RawMaterialCategory>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<ApiResponse<PageResponse<RawMaterialCategory>>>(
      `${environment.apiUrl}/categories`,
      { params }
    ).pipe(extractData());
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: number): Observable<RawMaterialCategory> {
    return this.http.get<ApiResponse<RawMaterialCategory>>(`${environment.apiUrl}/categories/${id}`)
      .pipe(extractData());
  }

  /**
   * Create new category
   */
  createCategory(request: CreateCategoryRequest): Observable<RawMaterialCategory> {
    return this.http.post<ApiResponse<RawMaterialCategory>>(`${environment.apiUrl}/categories`, request)
      .pipe(extractData());
  }

  /**
   * Update existing category
   */
  updateCategory(id: number, request: UpdateCategoryRequest): Observable<RawMaterialCategory> {
    return this.http.put<ApiResponse<RawMaterialCategory>>(`${environment.apiUrl}/categories/${id}`, request)
      .pipe(extractData());
  }

  /**
   * Delete category
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/categories/${id}`)
      .pipe(extractData());
  }

  // ==================== Measurement Units ====================

  /**
   * Get all measurement units
   */
  getUnits(): Observable<MeasurementUnit[]> {
    return this.http.get<ApiResponse<MeasurementUnit[]>>(`${environment.apiUrl}/units`)
      .pipe(extractData());
  }

  /**
   * Get paginated measurement units
   */
  getUnitsPaginated(
    page: number = 0,
    size: number = 10,
    sort?: string
  ): Observable<PageResponse<MeasurementUnit>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<ApiResponse<PageResponse<MeasurementUnit>>>(`${environment.apiUrl}/units`, { params })
      .pipe(extractData());
  }

  /**
   * Get unit by ID
   */
  getUnitById(id: number): Observable<MeasurementUnit> {
    return this.http.get<ApiResponse<MeasurementUnit>>(`${environment.apiUrl}/units/${id}`)
      .pipe(extractData());
  }

  /**
   * Create new measurement unit
   */
  createUnit(request: CreateUnitRequest): Observable<MeasurementUnit> {
    return this.http.post<ApiResponse<MeasurementUnit>>(`${environment.apiUrl}/units`, request)
      .pipe(extractData());
  }

  /**
   * Update existing measurement unit
   */
  updateUnit(id: number, request: UpdateUnitRequest): Observable<MeasurementUnit> {
    return this.http.put<ApiResponse<MeasurementUnit>>(`${environment.apiUrl}/units/${id}`, request)
      .pipe(extractData());
  }

  /**
   * Delete measurement unit
   */
  deleteUnit(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/units/${id}`)
      .pipe(extractData());
  }

  // ==================== Unit Conversions ====================

  /**
   * Get all unit conversions
   */
  getConversions(): Observable<UnitConversion[]> {
    return this.http.get<ApiResponse<UnitConversion[]>>(`${environment.apiUrl}/conversions`)
      .pipe(extractData());
  }

  /**
   * Get conversions for a specific unit
   */
  getConversionsByUnit(unitId: number): Observable<UnitConversion[]> {
    return this.http.get<ApiResponse<UnitConversion[]>>(`${environment.apiUrl}/conversions/unit/${unitId}`)
      .pipe(extractData());
  }

  /**
   * Create new unit conversion
   */
  createConversion(request: CreateConversionRequest): Observable<UnitConversion> {
    return this.http.post<ApiResponse<UnitConversion>>(`${environment.apiUrl}/conversions`, request)
      .pipe(extractData());
  }

  /**
   * Update existing unit conversion
   */
  updateConversion(id: number, conversionFactor: number): Observable<UnitConversion> {
    return this.http.put<ApiResponse<UnitConversion>>(`${environment.apiUrl}/conversions/${id}`, {
      conversionFactor,
    }).pipe(extractData());
  }

  /**
   * Delete unit conversion
   */
  deleteConversion(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/conversions/${id}`)
      .pipe(extractData());
  }

  /**
   * Convert quantity from one unit to another
   */
  convertQuantity(fromUnitId: number, toUnitId: number, quantity: number): Observable<number> {
    return this.http.post<ApiResponse<number>>(`${environment.apiUrl}/conversions/convert`, {
      fromUnitId,
      toUnitId,
      quantity,
    }).pipe(extractData());
  }

  // ==================== Allergens ====================

  /**
   * Get all allergens
   */
  getAllergens(): Observable<Allergen[]> {
    return this.http.get<ApiResponse<Allergen[]>>(`${environment.apiUrl}/allergens`)
      .pipe(extractData());
  }

  /**
   * Get allergen by ID
   */
  getAllergenById(id: number): Observable<Allergen> {
    return this.http.get<ApiResponse<Allergen>>(`${environment.apiUrl}/allergens/${id}`)
      .pipe(extractData());
  }

  // ==================== Statistics ====================

  /**
   * Get raw materials statistics
   */
  getStatistics(): Observable<{
    totalRawMaterials: number;
    activeRawMaterials: number;
    inactiveRawMaterials: number;
    lowStockCount: number;
    totalCategories: number;
    averageCostPerKg: number;
  }> {
    return this.http.get<ApiResponse<{
      totalRawMaterials: number;
      activeRawMaterials: number;
      inactiveRawMaterials: number;
      lowStockCount: number;
      totalCategories: number;
      averageCostPerKg: number;
    }>>(`${this.apiUrl}/statistics`).pipe(extractData());
  }
}
