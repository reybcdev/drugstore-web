import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInventoryStore } from '@/stores/inventory-store.ts';
import { useDeleteProduct } from '@/hooks/use-inventory.ts';

export const DeleteConfirmationModal = () => {
  const { isDeleteDialogOpen, productToDelete, closeDeleteDialog } = useInventoryStore();
  const deleteProduct = useDeleteProduct();

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct.mutateAsync(productToDelete);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (!isDeleteDialogOpen || !productToDelete) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="text-lg font-medium text-gray-900 mt-4">
            Delete Product
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-center space-x-3 mt-4">
            <Button
              variant="outline"
              onClick={closeDeleteDialog}
              disabled={deleteProduct.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
