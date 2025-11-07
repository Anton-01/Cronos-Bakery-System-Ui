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
} from '../../shared/models/raw-material.model';
import { PageResponse } from '../../shared/models/common.model';

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
  getRawMaterials(
    page: number = 0,
    size: number = 10,
    sort?: string,
    filters?: {
      name?: string;
      categoryId?: number;
      isActive?: boolean;
      allergenIds?: number[];
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

    return this.http.get<PageResponse<RawMaterial>>(this.apiUrl, { params });
  }

  /**
   * Get raw material by ID
   */
  getRawMaterialById(id: number): Observable<RawMaterial> {
    return this.http.get<RawMaterial>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new raw material
   */
  createRawMaterial(request: CreateRawMaterialRequest): Observable<RawMaterial> {
    return this.http.post<RawMaterial>(this.apiUrl, request);
  }

  /**
   * Update existing raw material
   */
  updateRawMaterial(id: number, request: UpdateRawMaterialRequest): Observable<RawMaterial> {
    return this.http.put<RawMaterial>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete raw material (soft delete)
   */
  deleteRawMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Restore deleted raw material
   */
  restoreRawMaterial(id: number): Observable<RawMaterial> {
    return this.http.put<RawMaterial>(`${this.apiUrl}/${id}/restore`, {});
  }

  /**
   * Get low stock raw materials
   */
  getLowStockRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(`${this.apiUrl}/low-stock`);
  }

  // ==================== Categories ====================

  /**
   * Get all categories
   */
  getCategories(): Observable<RawMaterialCategory[]> {
    return this.http.get<RawMaterialCategory[]>(`${environment.apiUrl}/categories`);
  }

  /**
   * Get paginated categories
   */
  getCategoriesPaginated(
    page: number = 0,
    size: number = 10,
    sort?: string
  ): Observable<PageResponse<RawMaterialCategory>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PageResponse<RawMaterialCategory>>(
      `${environment.apiUrl}/categories`,
      { params }
    );
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: number): Observable<RawMaterialCategory> {
    return this.http.get<RawMaterialCategory>(`${environment.apiUrl}/categories/${id}`);
  }

  /**
   * Create new category
   */
  createCategory(request: CreateCategoryRequest): Observable<RawMaterialCategory> {
    return this.http.post<RawMaterialCategory>(`${environment.apiUrl}/categories`, request);
  }

  /**
   * Update existing category
   */
  updateCategory(id: number, request: UpdateCategoryRequest): Observable<RawMaterialCategory> {
    return this.http.put<RawMaterialCategory>(`${environment.apiUrl}/categories/${id}`, request);
  }

  /**
   * Delete category
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/categories/${id}`);
  }

  // ==================== Measurement Units ====================

  /**
   * Get all measurement units
   */
  getUnits(): Observable<MeasurementUnit[]> {
    return this.http.get<MeasurementUnit[]>(`${environment.apiUrl}/units`);
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

    return this.http.get<PageResponse<MeasurementUnit>>(`${environment.apiUrl}/units`, { params });
  }

  /**
   * Get unit by ID
   */
  getUnitById(id: number): Observable<MeasurementUnit> {
    return this.http.get<MeasurementUnit>(`${environment.apiUrl}/units/${id}`);
  }

  /**
   * Create new measurement unit
   */
  createUnit(request: CreateUnitRequest): Observable<MeasurementUnit> {
    return this.http.post<MeasurementUnit>(`${environment.apiUrl}/units`, request);
  }

  /**
   * Update existing measurement unit
   */
  updateUnit(id: number, request: UpdateUnitRequest): Observable<MeasurementUnit> {
    return this.http.put<MeasurementUnit>(`${environment.apiUrl}/units/${id}`, request);
  }

  /**
   * Delete measurement unit
   */
  deleteUnit(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/units/${id}`);
  }

  // ==================== Unit Conversions ====================

  /**
   * Get all unit conversions
   */
  getConversions(): Observable<UnitConversion[]> {
    return this.http.get<UnitConversion[]>(`${environment.apiUrl}/conversions`);
  }

  /**
   * Get conversions for a specific unit
   */
  getConversionsByUnit(unitId: number): Observable<UnitConversion[]> {
    return this.http.get<UnitConversion[]>(`${environment.apiUrl}/conversions/unit/${unitId}`);
  }

  /**
   * Create new unit conversion
   */
  createConversion(request: CreateConversionRequest): Observable<UnitConversion> {
    return this.http.post<UnitConversion>(`${environment.apiUrl}/conversions`, request);
  }

  /**
   * Update existing unit conversion
   */
  updateConversion(id: number, conversionFactor: number): Observable<UnitConversion> {
    return this.http.put<UnitConversion>(`${environment.apiUrl}/conversions/${id}`, {
      conversionFactor,
    });
  }

  /**
   * Delete unit conversion
   */
  deleteConversion(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/conversions/${id}`);
  }

  /**
   * Convert quantity from one unit to another
   */
  convertQuantity(fromUnitId: number, toUnitId: number, quantity: number): Observable<number> {
    return this.http.post<number>(`${environment.apiUrl}/conversions/convert`, {
      fromUnitId,
      toUnitId,
      quantity,
    });
  }

  // ==================== Allergens ====================

  /**
   * Get all allergens
   */
  getAllergens(): Observable<Allergen[]> {
    return this.http.get<Allergen[]>(`${environment.apiUrl}/allergens`);
  }

  /**
   * Get allergen by ID
   */
  getAllergenById(id: number): Observable<Allergen> {
    return this.http.get<Allergen>(`${environment.apiUrl}/allergens/${id}`);
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
    return this.http.get<{
      totalRawMaterials: number;
      activeRawMaterials: number;
      inactiveRawMaterials: number;
      lowStockCount: number;
      totalCategories: number;
      averageCostPerKg: number;
    }>(`${this.apiUrl}/statistics`);
  }
}
