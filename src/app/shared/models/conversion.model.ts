import { MeasurementUnitResponse } from './raw-material.model';

/**
 * Conversion factor response
 */
export interface ConversionFactorResponse {
  id: number;
  fromUnit: MeasurementUnitResponse;
  toUnit: MeasurementUnitResponse;
  factor: number;
  notes?: string;
  isSystemDefault: boolean;
  createdAt: string;
  user: string;
}

/**
 * Create conversion factor request
 */
export interface CreateConversionFactorRequest {
  fromUnitId: number;
  toUnitId: number;
  factor: number;
  notes?: string;
}

/**
 * Conversion request
 */
export interface ConversionRequest {
  quantity: number;
  fromUnitId: number;
  toUnitId: number;
}

/**
 * Conversion result
 */
export interface ConversionResult {
  originalQuantity: number;
  originalUnit: MeasurementUnitResponse;
  convertedQuantity: number;
  convertedUnit: MeasurementUnitResponse;
  conversionFactor: number;
}
