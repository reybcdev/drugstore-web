import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Product } from '../../types/inventory'
import { inventoryApi } from '../../services/api'

interface DeleteConfirmationModalProps {
  /** Product to be deleted */
  readonly product: Product;
  /** Modal open state */
  readonly isOpen: boolean;
  /** Handler for closing the modal */
  readonly onClose: () => void;
}

/**
 * Modal for confirming product deletion
 * @param props - Component props
 * @returns Delete confirmation modal component
 */
function DeleteConfirmationModal({ 
  product, 
  isOpen, 
  onClose 
}: DeleteConfirmationModalProps): JSX.Element | null {
  const queryClient = useQueryClient()
  
  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (productId: number) => inventoryApi.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onClose()
    }
  })

  /**
   * Handle delete confirmation
   */
  const handleConfirmDelete = (): void => {
    deleteMutation.mutate(product.id)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        
        <p className="mb-6">
          Are you sure you want to delete the product "{product.name}"? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal