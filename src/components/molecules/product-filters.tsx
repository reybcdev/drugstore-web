import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ProductFilters } from '../../types/inventory'
import { inventoryApi } from '../../services/api'

interface ProductFiltersProps {
  /** Current filter values */
  readonly filters: ProductFilters;
  /** Handler for filter changes */
  readonly onFilterChange: (filters: ProductFilters) => void;
}

/**
 * Filter controls for the product inventory list
 * @param props - Component props
 * @returns Filter UI component
 */
function ProductFilters({ filters, onFilterChange }: ProductFiltersProps): JSX.Element {
  // Fetch categories for dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => inventoryApi.getCategories(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  /**
   * Handle text search input changes
   * @param e - Input change event
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onFilterChange({
      ...filters,
      searchTerm: e.target.value
    })
  }

  /**
   * Handle category dropdown changes
   * @param e - Select change event
   */
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onFilterChange({
      ...filters,
      category: e.target.value
    })
  }

  /**
   * Handle stock status filter changes
   * @param e - Select change event
   */
  const handleStockStatusChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onFilterChange({
      ...filters,
      stockStatus: e.target.value as 'all' | 'inStock' | 'lowStock' | 'outOfStock'
    })
  }

  /**
   * Handle expiry status filter changes
   * @param e - Select change event
   */
  const handleExpiryStatusChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onFilterChange({
      ...filters,
      expiryStatus: e.target.value as 'all' | 'expired' | 'expiringSoon' | 'valid'
    })
  }

  /**
   * Clear all filters
   */
  const handleClearFilters = (): void => {
    onFilterChange({
      searchTerm: '',
      category: '',
      stockStatus: 'all',
      expiryStatus: 'all'
    })
  }

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            value={filters.searchTerm || ''}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Category filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.category || ''}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Stock status filter */}
        <div>
          <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Status
          </label>
          <select
            id="stockStatus"
            value={filters.stockStatus || 'all'}
            onChange={handleStockStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Stock Status</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        {/* Expiry status filter */}
        <div>
          <label htmlFor="expiryStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Status
          </label>
          <select
            id="expiryStatus"
            value={filters.expiryStatus || 'all'}
            onChange={handleExpiryStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Expiry Status</option>
            <option value="valid">Valid</option>
            <option value="expiringSoon">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Clear filters button */}
        <div className="flex items-end">
          <button
            onClick={handleClearFilters}
            className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductFilters