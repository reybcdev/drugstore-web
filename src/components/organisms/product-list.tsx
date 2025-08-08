import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { inventoryApi } from '../../services/api'
import { Product, ProductFilters } from '../../types/inventory'
import { formatCurrency, formatDate, isLowStock, isExpired, isExpiringSoon } from '../../lib/utils'
import ProductFilters from '../molecules/product-filters'

interface ProductListProps {
  /** Handler for editing a product */
  readonly onEdit: (product: Product) => void;
  /** Handler for deleting a product */
  readonly onDelete: (product: Product) => void;
}

/**
 * Displays a list of inventory products with filtering options
 * @param props - Component props
 * @returns Product list component
 */
function ProductList({ onEdit, onDelete }: ProductListProps): JSX.Element {
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: '',
    category: '',
    stockStatus: 'all',
    expiryStatus: 'all'
  })

  // Fetch products data
  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => inventoryApi.getProducts(filters as unknown as Record<string, string>)
  })

  /**
   * Handle filter changes from the filter component
   * @param newFilters - Updated filters
   */
  const handleFilterChange = (newFilters: ProductFilters): void => {
    setFilters(newFilters)
  }

  /**
   * Get the appropriate status badge class for a product
   * @param product - Product to check status for
   * @returns CSS class string for the badge
   */
  const getStatusBadgeClass = (product: Product): string => {
    if (product.stockQuantity === 0) {
      return 'bg-red-100 text-red-800'
    }
    if (isLowStock(product.stockQuantity, product.minimumStockThreshold)) {
      return 'bg-yellow-100 text-yellow-800'
    }
    if (isExpired(product.expiryDate)) {
      return 'bg-red-100 text-red-800'
    }
    if (isExpiringSoon(product.expiryDate)) {
      return 'bg-orange-100 text-orange-800'
    }
    return 'bg-green-100 text-green-800'
  }

  /**
   * Get the status text for a product
   * @param product - Product to check status for
   * @returns Status text
   */
  const getStatusText = (product: Product): string => {
    if (product.stockQuantity === 0) {
      return 'Out of Stock'
    }
    if (isLowStock(product.stockQuantity, product.minimumStockThreshold)) {
      return 'Low Stock'
    }
    if (isExpired(product.expiryDate)) {
      return 'Expired'
    }
    if (isExpiringSoon(product.expiryDate)) {
      return 'Expiring Soon'
    }
    return 'In Stock'
  }

  // Loading state
  if (isLoading) {
    return <div className="text-center p-8">Loading products...</div>
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading products: {(error as Error).message}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
      
      {products.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-md">
          No products found matching your criteria
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Expiry Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.stockQuantity}</td>
                  <td className="px-4 py-2">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-2">{formatDate(product.expiryDate)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(product)}`}>
                      {getStatusText(product)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProductList