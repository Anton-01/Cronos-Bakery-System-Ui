/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalRawMaterials: number;
  totalRecipes: number;
  totalQuotes: number;
  lowStockItems: number;
  pendingQuotes: number;
  totalRevenue: number;
  recentActivities: Activity[];
}

/**
 * Activity log entry
 */
export interface Activity {
  id: number;
  type: ActivityType;
  description: string;
  entityType: string;
  entityId: number;
  entityName: string;
  timestamp: string;
  user: string;
}

/**
 * Activity types
 */
export enum ActivityType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  STOCK_ADJUSTED = 'STOCK_ADJUSTED',
  QUOTE_SENT = 'QUOTE_SENT',
  QUOTE_ACCEPTED = 'QUOTE_ACCEPTED',
  QUOTE_REJECTED = 'QUOTE_REJECTED',
}
