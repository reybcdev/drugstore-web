import axios from 'axios';
import type { Product, NewProduct } from '../types/inventory';
import { 
  transformApiProduct, 
  transformNewProductToApi, 
  transformProductToApi 
} from '../lib/transformers';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Inventory API service for managing products
 */
export const inventoryApi = {
  /**
   * Retrieves all products from the inventory
   */
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products/');
    return response.data.map(transformApiProduct);
  },

  /**
   * Retrieves a single product by ID
   */
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}/`);
    return transformApiProduct(response.data);
  },

  /**
   * Creates a new product in the inventory
   */
  createProduct: async (product: NewProduct): Promise<Product> => {
    const apiProduct = transformNewProductToApi(product);
    const response = await api.post('/products/', apiProduct);
    return transformApiProduct(response.data);
  },

  /**
   * Updates an existing product
   */
  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    const apiProduct = transformProductToApi(product as Product);
    const response = await api.put(`/products/${id}/`, apiProduct);
    return transformApiProduct(response.data);
  },

  /**
   * Deletes a product from the inventory
   */
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/inventory/products/${id}/`);
  },

  /**
   * Retrieves products with low stock levels
   */
  getLowStockProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products/low-stock/');
    return response.data.map(transformApiProduct);
  },

  /**
   * Retrieves products that are expiring soon
   */
  getExpiringProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products/expiring/');
    return response.data.map(transformApiProduct);
  },
};

export default api;
