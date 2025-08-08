import { useState, useEffect } from 'react';
import { Edit, Trash2, AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product, ProductFiltersOptions } from '../../types/inventory';
import { inventoryApi } from '../../services/api';
import { INVENTORY_CONSTANTS } from '../../types/inventory';

interface ProductListProps {
  readonly onEditProduct: (product: Product) => void;
  readonly onDeleteProduct: (id: number) => void;
  readonly filters: ProductFiltersOptions;
  readonly refreshTrigger: number;
}

/**
 * Product list organism component for displaying inventory items
 */
const ProductList: React.FC<ProductListProps> = ({ 
  onEditProduct, 
  onDeleteProduct, 
  filters, 
  refreshTrigger 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [filters, refreshTrigger]);

  /**
   * Fetches products based on current filters
   */
  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedProducts = await getFilteredProducts();
      const clientFilteredProducts = applyClientFilters(fetchedProducts);
      
      setProducts(clientFilteredProducts);
    } catch (err) {
      handleFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gets products from API based on filter type
   */
  const getFilteredProducts = async (): Promise<Product[]> => {
    if (filters.lowStock) {
      return await inventoryApi.getLowStockProducts();
    }
    if (filters.expiringSoon) {
      return await inventoryApi.getExpiringProducts();
    }
    return await inventoryApi.getProducts();
  };

  /**
   * Applies client-side filters to products
   */
  const applyClientFilters = (products: Product[]): Product[] => {
    let filteredProducts = products;
    
    if (filters.category) {
      filteredProducts = filterByCategory(filteredProducts, filters.category);
    }
    
    if (filters.supplier) {
      filteredProducts = filterBySupplier(filteredProducts, filters.supplier);
    }

    return filteredProducts;
  };

  /**
   * Filters products by category
   */
  const filterByCategory = (products: Product[], category: string): Product[] => {
    return products.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  };

  /**
   * Filters products by supplier
   */
  const filterBySupplier = (products: Product[], supplier: string): Product[] => {
    return products.filter(product => 
      product.supplier.toLowerCase().includes(supplier.toLowerCase())
    );
  };

  /**
   * Handles fetch errors
   */
  const handleFetchError = (err: unknown): void => {
    setError('Error fetching products. Make sure the API is running.');
    console.error('Error fetching products:', err);
  };

  /**
   * Formats date string for display
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  /**
   * Formats price for display
   */
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  /**
   * Checks if product has low stock
   */
  const isLowStock = (quantity: number): boolean => {
    return quantity < INVENTORY_CONSTANTS.LOW_STOCK_THRESHOLD;
  };

  /**
   * Checks if product is expiring soon
   */
  const isExpiringSoon = (expiryDate: string): boolean => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= INVENTORY_CONSTANTS.EXPIRY_WARNING_DAYS;
  };

  /**
   * Renders loading state
   */
  const renderLoadingState = () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">Loading products...</span>
    </div>
  );

  /**
   * Renders error state
   */
  const renderErrorState = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700">{error}</span>
      </div>
    </div>
  );

  /**
   * Renders empty state
   */
  const renderEmptyState = () => (
    <div className="text-center py-8">
      <Package className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your filters or add some products to get started.
      </p>
    </div>
  );

  /**
   * Renders product status badges
   */
  const renderStatusBadges = (product: Product) => (
    <div className="flex gap-1">
      {isLowStock(product.stockQuantity) && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Low Stock
        </span>
      )}
      {isExpiringSoon(product.expiryDate) && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Expiring Soon
        </span>
      )}
    </div>
  );

  /**
   * Renders action buttons for each product
   */
  const renderActionButtons = (product: Product) => (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEditProduct(product)}
        className="flex items-center"
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDeleteProduct(product.id)}
        className="flex items-center"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  );

  if (loading) return renderLoadingState();
  if (error) return renderErrorState();
  if (products.length === 0) return renderEmptyState();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.supplier}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.stockQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(product.expiryDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatusBadges(product)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderActionButtons(product)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
