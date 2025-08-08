import axios from 'axios'
import { Product, ProductFormData } from '../types/inventory'
import { camelToSnake, snakeToCamel } from '../lib/utils'

// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Transforms snake_case response data to camelCase
 * @param data - Data to transform
 * @returns Transformed data with camelCase keys
 */
const transformResponseData = (data: Record<string, any>): Record<string, any> => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    acc[snakeToCamel(key)] = value
    return acc
  }, {} as Record<string, any>)
}

/**
 * Transforms camelCase request data to snake_case
 * @param data - Data to transform
 * @returns Transformed data with snake_case keys
 */
const transformRequestData = (data: Record<string, any>): Record<string, any> => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    acc[camelToSnake(key)] = value
    return acc
  }, {} as Record<string, any>)
}

/**
 * API service for inventory operations
 */
export const inventoryApi = {
  /**
   * Fetches all products with optional filters
   * @param params - Optional query parameters
   * @returns Promise with products
   */
  getProducts: async (params?: Record<string, string>): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/inventory/products/', { params })
      return response.data.map(transformResponseData) as Product[]
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  /**
   * Fetches a single product by ID
   * @param id - Product ID
   * @returns Promise with product details
   */
  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await apiClient.get(`/inventory/products/${id}/`)
      return transformResponseData(response.data) as Product
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error)
      throw error
    }
  },

  /**
   * Creates a new product
   * @param productData - Product data to create
   * @returns Promise with created product
   */
  createProduct: async (productData: ProductFormData): Promise<Product> => {
    try {
      const transformedData = transformRequestData(productData as unknown as Record<string, any>)
      const response = await apiClient.post('/inventory/products/', transformedData)
      return transformResponseData(response.data) as Product
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  /**
   * Updates an existing product
   * @param id - Product ID
   * @param productData - Updated product data
   * @returns Promise with updated product
   */
  updateProduct: async (id: number, productData: ProductFormData): Promise<Product> => {
    try {
      const transformedData = transformRequestData(productData as unknown as Record<string, any>)
      const response = await apiClient.put(`/inventory/products/${id}/`, transformedData)
      return transformResponseData(response.data) as Product
    } catch (error) {
      console.error(`Error updating product ${id}:`, error)
      throw error
    }
  },

  /**
   * Deletes a product by ID
   * @param id - Product ID to delete
   * @returns Promise with success status
   */
  deleteProduct: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/inventory/products/${id}/`)
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error)
      throw error
    }
  },

  /**
   * Fetches all product categories
   * @returns Promise with list of categories
   */
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get('/inventory/categories/')
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }
}