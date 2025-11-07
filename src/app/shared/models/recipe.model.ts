import { AllergenResponse, CategoryResponse, MeasurementUnitResponse } from './raw-material.model';

/**
 * Recipe response from API
 */
export interface RecipeResponse {
  id: number;
  name: string;
  description?: string;
  user: string;
  category?: CategoryResponse;
  yieldQuantity: number;
  yieldUnit: string;
  preparationTimeMinutes?: number;
  bakingTimeMinutes?: number;
  coolingTimeMinutes?: number;
  status: RecipeStatus;
  ingredients: RecipeIngredientResponse[];
  subRecipes?: RecipeSubRecipeResponse[];
  fixedCosts?: RecipeFixedCostResponse[];
  allergens: AllergenResponse[];
  currentVersion: number;
  totalCost: number;
  instructions?: string;
  storageInstructions?: string;
  shelfLifeDays?: number;
  isActive: boolean;
  needsRecalculation: boolean;
}

/**
 * Recipe status enum
 */
export enum RecipeStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Create recipe request
 */
export interface CreateRecipeRequest {
  name: string;
  description?: string;
  categoryId?: number;
  yieldQuantity: number;
  yieldUnit: string;
  preparationTimeMinutes?: number;
  bakingTimeMinutes?: number;
  coolingTimeMinutes?: number;
  instructions?: string;
  ingredients: RecipeIngredientRequest[];
  subRecipes?: RecipeSubRecipeRequest[];
  fixedCosts?: RecipeFixedCostRequest[];
}

/**
 * Update recipe request
 */
export interface UpdateRecipeRequest {
  name?: string;
  description?: string;
  categoryId?: number;
  yieldQuantity?: number;
  yieldUnit?: string;
  preparationTimeMinutes?: number;
  bakingTimeMinutes?: number;
  coolingTimeMinutes?: number;
  instructions?: string;
  ingredients?: RecipeIngredientRequest[];
  subRecipes?: RecipeSubRecipeRequest[];
  fixedCosts?: RecipeFixedCostRequest[];
}

/**
 * Recipe ingredient response
 */
export interface RecipeIngredientResponse {
  id: number;
  rawMaterialId: number;
  rawMaterialName: string;
  quantity: number;
  unit: MeasurementUnitResponse;
  displayOrder: number;
  isOptional: boolean;
  notes?: string;
  cost: number;
}

/**
 * Recipe ingredient request
 */
export interface RecipeIngredientRequest {
  rawMaterialId: number;
  quantity: number;
  unitId: number;
  displayOrder?: number;
  isOptional?: boolean;
  notes?: string;
}

/**
 * Recipe sub-recipe response
 */
export interface RecipeSubRecipeResponse {
  id: number;
  subRecipeId: number;
  subRecipeName: string;
  quantity: number;
  displayOrder: number;
  notes?: string;
  cost: number;
}

/**
 * Recipe sub-recipe request
 */
export interface RecipeSubRecipeRequest {
  subRecipeId: number;
  quantity: number;
  displayOrder?: number;
  notes?: string;
}

/**
 * Recipe fixed cost response
 */
export interface RecipeFixedCostResponse {
  id: number;
  name: string;
  description?: string;
  type: string;
  amount: number;
  calculationMethod: FixedCostCalculationMethod;
  timeInMinutes?: number;
  percentage?: number;
}

/**
 * Recipe fixed cost request
 */
export interface RecipeFixedCostRequest {
  name: string;
  description?: string;
  type: string;
  amount: number;
  calculationMethod: FixedCostCalculationMethod;
  timeInMinutes?: number;
  percentage?: number;
}

/**
 * Fixed cost calculation method
 */
export enum FixedCostCalculationMethod {
  FIXED = 'FIXED',
  PER_MINUTE = 'PER_MINUTE',
  PERCENTAGE = 'PERCENTAGE',
}

/**
 * Recipe cost calculation response
 */
export interface RecipeCostResponse {
  materialsCost: number;
  fixedCosts: number;
  subRecipesCost: number;
  totalCost: number;
  costPerUnit: number;
  currency: string;
  scaleFactor: number;
}

/**
 * Recipe version response
 */
export interface RecipeVersionResponse {
  id: number;
  recipeId: number;
  versionNumber: number;
  changeDescription: string;
  createdAt: string;
  createdBy: string;
  snapshot: string; // JSON snapshot of the recipe
}
