/**
 * Represents a product in the inventory system
 */
export interface Product {
  /** Unique identifier for the product */
  readonly id: number;
  /** Name of the product */
  readonly name: string;
  /** Description of the product */
  readonly description: string;
  /** Current stock quantity */
  readonly stockQuantity: number;
  /** Price of the product in USD */
  readonly price: number;
  /** Expiration date of the product */
  readonly expiryDate: string;
  /** Category the product belongs to */
  readonly category: string;
  /** Supplier of the product */
  readonly supplier: string;
  /** The minimum stock threshold for low stock warning */
  readonly minimumStockThreshold: number;
  /** Date when the product was added to inventory */
  readonly createdAt: string;
  /** Date when the product information was last updated */
  readonly updatedAt: string;
}

/**
 * Input data structure for creating/updating a product
 * Omits read-only fields like ID and timestamps
 */
export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Filter options for product inventory queries
 */
export interface ProductFilters {
  /** Text to search in product name or description */
  readonly searchTerm?: string;
  /** Filter by product category */
  readonly category?: string;
  /** Filter by stock status */
  readonly stockStatus?: 'all' | 'inStock' | 'lowStock' | 'outOfStock';
  /** Filter by expiration status */
  readonly expiryStatus?: 'all' | 'expired' | 'expiringSoon' | 'valid';
}

/**
 * Constants related to inventory management
 */
export const INVENTORY_CONSTANTS = {
  /** Default minimum stock threshold */
  DEFAULT_MIN_STOCK: 10,
  /** Days threshold for "expiring soon" status */
  EXPIRING_SOON_DAYS: 30,
}