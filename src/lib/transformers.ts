import type { Product, NewProduct } from '../types/inventory';

/**
 * Transforms API response product to internal Product type
 */
export const transformApiProduct = (apiProduct: any): Product => ({
  id: apiProduct.id,
  name: apiProduct.name,
  description: apiProduct.description,
  price: typeof apiProduct.price === 'string' ? parseFloat(apiProduct.price) : apiProduct.price,
  stockQuantity: apiProduct.stock_quantity,
  category: apiProduct.category,
  supplier: apiProduct.supplier,
  expiryDate: apiProduct.expiry_date,
  createdAt: apiProduct.created_at,
  updatedAt: apiProduct.updated_at,
});

/**
 * Transforms internal NewProduct to API format
 */
export const transformNewProductToApi = (product: NewProduct): any => ({
  name: product.name,
  description: product.description,
  price: product.price,
  stock_quantity: product.stockQuantity,
  category: product.category,
  supplier: product.supplier,
  expiry_date: product.expiryDate,
});

/**
 * Transforms internal Product to API format for updates
 */
export const transformProductToApi = (product: Product): any => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  stock_quantity: product.stockQuantity,
  category: product.category,
  supplier: product.supplier,
  expiry_date: product.expiryDate,
});
