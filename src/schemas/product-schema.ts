import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Product name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  price: z.number().min(0, 'Price must be positive').max(999999, 'Price is too high'),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be non-negative'),
  category: z.string().min(1, 'Category is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
});

export const productFiltersSchema = z.object({
  category: z.string().optional(),
  supplier: z.string().optional(),
  lowStock: z.boolean().optional(),
  expiringSoon: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductFiltersData = z.infer<typeof productFiltersSchema>;
