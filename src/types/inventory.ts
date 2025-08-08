/**
 * Represents a product in the inventory system
 */
export interface Product {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly stockQuantity: number;
  readonly category: string;
  readonly supplier: string;
  readonly expiryDate: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Data required to create a new product
 */
export interface NewProduct {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly stockQuantity: number;
  readonly category: string;
  readonly supplier: string;
  readonly expiryDate: string;
}

/**
 * Filter options for product queries
 */
export interface ProductFiltersOptions {
  readonly category?: string;
  readonly supplier?: string;
  readonly lowStock?: boolean;
  readonly expiringSoon?: boolean;
}

/**
 * Constants used throughout the inventory system
 */
export const INVENTORY_CONSTANTS = {
  /** Threshold below which stock is considered low */
  LOW_STOCK_THRESHOLD: 10,
  /** Number of days before expiry to show warning */
  EXPIRY_WARNING_DAYS: 30,
} as const;
