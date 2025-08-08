import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ProductFiltersOptions } from '../../types/inventory';

interface ProductFiltersProps {
  readonly filters: ProductFiltersOptions;
  readonly onFiltersChange: (filters: ProductFiltersOptions) => void;
}

/**
 * Product filters molecule component for filtering inventory items
 */
const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFiltersChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierTerm, setSupplierTerm] = useState('');

  /**
   * Handles search input changes
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchTerm(value);
    onFiltersChange({
      ...filters,
      category: value || undefined,
    });
  };

  /**
   * Handles supplier input changes
   */
  const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSupplierTerm(value);
    onFiltersChange({
      ...filters,
      supplier: value || undefined,
    });
  };

  /**
   * Handles filter toggle changes
   */
  const handleFilterToggle = (filterKey: keyof ProductFiltersOptions): void => {
    onFiltersChange({
      ...filters,
      [filterKey]: !filters[filterKey],
    });
  };

  /**
   * Clears all filters
   */
  const clearAllFilters = (): void => {
    setSearchTerm('');
    setSupplierTerm('');
    onFiltersChange({
      category: undefined,
      supplier: undefined,
      lowStock: false,
      expiringSoon: false,
    });
  };

  /**
   * Checks if any filters are active
   */
  const hasActiveFilters = (): boolean => {
    return !!(
      filters.category ||
      filters.supplier ||
      filters.lowStock ||
      filters.expiringSoon
    );
  };

  /**
   * Renders search input field
   */
  const renderSearchInput = (
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string
  ) => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10"
        aria-label={label}
      />
    </div>
  );

  /**
   * Renders filter toggle button
   */
  const renderFilterToggle = (
    key: keyof ProductFiltersOptions,
    label: string,
    isActive: boolean
  ) => (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={() => handleFilterToggle(key)}
      aria-pressed={isActive}
    >
      {label}
    </Button>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters() && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSearchInput(
            'Search by category',
            searchTerm,
            handleSearchChange,
            'Search by category...'
          )}
          {renderSearchInput(
            'Search by supplier',
            supplierTerm,
            handleSupplierChange,
            'Search by supplier...'
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {renderFilterToggle('lowStock', 'Low Stock', !!filters.lowStock)}
          {renderFilterToggle('expiringSoon', 'Expiring Soon', !!filters.expiringSoon)}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
