import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Store, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product, ProductFiltersOptions } from './types/inventory';
import ProductList from './components/organisms/product-list';
import ProductForm from './components/organisms/product-form';
import ProductFilters from './components/molecules/product-filters';
import { DeleteConfirmationModal } from './components/organisms/delete-confirmation-modal';
import { useInventoryStore } from './stores/inventory-store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Main application component for drugstore inventory management
 */
const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<ProductFiltersOptions>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Use Zustand store for delete modal state
  const { isDeleteDialogOpen, openDeleteDialog } = useInventoryStore();

  /**
   * Opens the product form for adding a new product
   */
  const handleAddProduct = (): void => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  /**
   * Opens the product form for editing an existing product
   */
  const handleEditProduct = (product: Product): void => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  /**
   * Opens the delete confirmation modal
   */
  const handleDeleteProduct = (id: number): void => {
    openDeleteDialog(id);
  };

  /**
   * Closes the product form
   */
  const handleCloseForm = (): void => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  /**
   * Handles successful product save
   */
  const handleSaveProduct = (): void => {
    setRefreshTrigger(prev => prev + 1);
  };

  /**
   * Renders the application header
   */
  const renderHeader = () => (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Store className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Drugstore Inventory Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage your pharmacy inventory efficiently
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-green-600 font-medium">
              API Connected
            </div>
            <Button
              onClick={handleAddProduct}
              className="flex items-center"
            >
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {renderHeader()}
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
          
          <ProductList
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            filters={filters}
            refreshTrigger={refreshTrigger}
          />
        </main>

        {showForm && (
          <ProductForm
            product={selectedProduct}
            onClose={handleCloseForm}
            onSave={handleSaveProduct}
          />
        )}

        {isDeleteDialogOpen && <DeleteConfirmationModal />}
      </div>
    </QueryClientProvider>
  );
};

export default App;
