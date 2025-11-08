/**
 * Raw Material response from API
 */
export interface RawMaterialResponse {
  id: number;
  name: string;
  description?: string;
  brand: string;
  supplier: string;
  category: CategoryResponse;
  user: string;
  purchaseUnit: MeasurementUnitResponse;
  purchaseQuantity: number;
  unitCost: number;
  currency: string;
  currentStock: number;
  minimumStock: number;
  lastPurchaseDate?: string;
  lastPriceUpdate?: string;
  allergens: AllergenResponse[];
  needsRecalculation: boolean;
  isActive: boolean;
}

/**
 * Create raw material request
 */
export interface CreateRawMaterialRequest {
  name: string;
  description?: string;
  brand: string;
  supplier: string;
  categoryId: number;
  purchaseUnitId: number;
  purchaseQuantity: number;
  unitCost: number;
  currency?: string;
  minimumStock?: number;
  allergenIds?: number[];
}

/**
 * Update raw material request
 */
export interface UpdateRawMaterialRequest {
  name?: string;
  description?: string;
  brand?: string;
  supplier?: string;
  categoryId?: number;
  purchaseUnitId?: number;
  purchaseQuantity?: number;
  unitCost?: number;
  currency?: string;
  minimumStock?: number;
  allergenIds?: number[];
}

/**
 * Category response
 */
export interface CategoryResponse {
  id: number;
  name: string;
  description?: string;
  isSystemDefault: boolean;
}

/**
 * Measurement unit response
 */
export interface MeasurementUnitResponse {
  id: number;
  code: string;
  name: string;
  namePlural: string;
  type: MeasurementUnitType;
  isSystemDefault: boolean;
}

/**
 * Measurement unit types
 */
export enum MeasurementUnitType {
  WEIGHT = 'WEIGHT',
  VOLUME = 'VOLUME',
  PIECE = 'PIECE',
  CONTAINER = 'CONTAINER',
}

/**
 * Allergen response
 */
export interface AllergenResponse {
  id: number;
  name: string;
  nameEn?: string;
  nameEs?: string;
  description?: string;
  isSystemDefault: boolean;
}

/**
 * Price history response
 */
export interface PriceHistoryResponse {
  id: number;
  rawMaterial: RawMaterialResponse;
  previousCost: number;
  newCost: number;
  changePercentage: number;
  currency: string;
  changedAt: string;
  changedBy: string;
}

/**
 * Stock operation type
 */
export enum StockOperation {
  INLET = 'INLET',
  OUTLET = 'OUTLET',
}

// Type aliases for backward compatibility
export type RawMaterial = RawMaterialResponse;
export type RawMaterialCategory = CategoryResponse;
export type CreateCategoryRequest = {
  name: string;
  description?: string;
};
export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;
export type MeasurementUnit = MeasurementUnitResponse;
export type CreateUnitRequest = {
  code: string;
  name: string;
  namePlural: string;
  type: MeasurementUnitType;
};
export type UpdateUnitRequest = Partial<CreateUnitRequest>;
export type UnitConversion = {
  id: number;
  fromUnit: MeasurementUnitResponse;
  toUnit: MeasurementUnitResponse;
  factor: number;
};
export type CreateConversionRequest = {
  fromUnitId: number;
  toUnitId: number;
  factor: number;
};
export type Allergen = AllergenResponse;
