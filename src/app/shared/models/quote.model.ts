import { RecipeResponse } from './recipe.model';

/**
 * Quote response from API
 */
export interface QuoteResponse {
  id: number;
  quoteNumber: string;
  user: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  notes?: string;
  status: QuoteStatus;
  validUntil: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  items: QuoteItemResponse[];
  shareToken?: string;
  isShareable: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Quote status enum
 */
export enum QuoteStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

/**
 * Create quote request
 */
export interface CreateQuoteRequest {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  notes?: string;
  validityDays?: number;
  items: QuoteItemRequest[];
}

/**
 * Update quote request
 */
export interface UpdateQuoteRequest {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  notes?: string;
  validityDays?: number;
  items?: QuoteItemRequest[];
  status?: QuoteStatus;
}

/**
 * Quote item response
 */
export interface QuoteItemResponse {
  id: number;
  recipe: RecipeResponse;
  quantity: number;
  scaleFactor: number;
  unitCost: number;
  unitPrice: number;
  profitPercentage: number;
  subtotal: number;
  notes?: string;
  displayOrder: number;
}

/**
 * Quote item request
 */
export interface QuoteItemRequest {
  recipeId: number;
  quantity: number;
  scaleFactor?: number;
  profitMarginId?: number;
}

/**
 * Share quote response
 */
export interface ShareQuoteResponse {
  shareToken: string;
  shareUrl: string;
  expiresAt: string;
}

/**
 * Quote access stats
 */
export interface QuoteAccessStats {
  quoteId: number;
  totalViews: number;
  uniqueVisitors: number;
  lastAccessedAt?: string;
  accessLog: QuoteAccessLog[];
}

/**
 * Quote access log entry
 */
export interface QuoteAccessLog {
  id: number;
  accessedAt: string;
  ipAddress: string;
  userAgent: string;
}

// Type alias for backward compatibility
export type Quote = QuoteResponse;
