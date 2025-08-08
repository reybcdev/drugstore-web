import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Product, ProductFormData } from '../../types/inventory'
import { inventoryApi } from '../../services/api'

interface ProductFormModalProps {
  /** Product to edit (null if creating new) */
  readonly product: Product | null;
  /** Modal open state */
  readonly isOpen: boolean;
  /** Handler for closing the modal */
  readonly onClose: () => void;
}

// Zod schema for form validation
const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be 0 or higher'),
  price: z.number().positive('Price must be greater than 0'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  category: z.string().min(1, 'Category is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  minimumStockThreshold: z.number().int().min(1, 'Minimum stock threshold must be at least 1')
})

/**
 * Modal form for creating or editing products
 * @param props - Component props
 * @returns Form modal component
 */
function ProductFormModal({ product, isOpen, onClose }: ProductFormModalProps): JSX.Element | null {
  const queryClient = useQueryClient()
  const isEditMode = !!product
  
  // Initialize form with react-hook-form
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: isEditMode ? {
      name: product.name,
      description: product.description,
      stockQuantity: product.stockQuantity,
      price: product.price,
      expiryDate: product.expiryDate.split('T')[0], // Format date for input
      category: product.category,
      supplier: product.supplier,
      minimumStockThreshold: product.minimumStockThreshold
    } : {
      name: '',
      description: '',
      stockQuantity: 0,
      price: 0,
      expiryDate: '',
      category: '',
      supplier: '',
      minimumStockThreshold: 10
    }
  })

  // Reset form when product changes
  useEffect(() => {
    if (isOpen) {
      reset(isEditMode ? {
        name: product.name,
        description: product.description,
        stockQuantity: product.stockQuantity,
        price: product.price,
        expiryDate: product.expiryDate.split('T')[0],
        category: product.category,
        supplier: product.supplier,
        minimumStockThreshold: product.minimumStockThreshold
      } : {
        name: '',
        description: '',
        stockQuantity: 0,
        price: 0,
        expiryDate: '',
        category: '',
        supplier: '',
        minimumStockThreshold: 10
      })
    }
  }, [isOpen, product, reset, isEditMode])

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => inventoryApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onClose()
    }
  })

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) => 
      inventoryApi.updateProduct(product?.id || 0, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onClose()
    }
  })

  /**
   * Handle form submission
   * @param data - Form data
   */
  const onSubmit = (data: ProductFormData): void => {
    if (isEditMode) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                id="category"
                type="text"
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Stock Quantity */}
            <div className="mb-4">
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                id="stockQuantity"
                type="number"
                min="0"
                {...register('stockQuantity', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.stockQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.stockQuantity.message}</p>
              )}
            </div>

            {/* Price */}
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div className="mb-4">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                type="date"
                {...register('expiryDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.expiryDate && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
              )}
            </div>

            {/* Supplier */}
            <div className="mb-4">
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                id="supplier"
                type="text"
                {...register('supplier')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.supplier && (
                <p className="mt-1 text-sm text-red-600">{errors.supplier.message}</p>
              )}
            </div>

            {/* Minimum Stock Threshold */}
            <div className="mb-4">
              <label htmlFor="minimumStockThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                Min Stock Threshold
              </label>
              <input
                id="minimumStockThreshold"
                type="number"
                min="1"
                {...register('minimumStockThreshold', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.minimumStockThreshold && (
                <p className="mt-1 text-sm text-red-600">{errors.minimumStockThreshold.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : isEditMode
                ? 'Update Product'
                : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal