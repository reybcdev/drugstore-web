import { useState } from 'react'
import ProductList from './components/organisms/product-list'
import ProductFormModal from './components/organisms/product-form-modal'
import DeleteConfirmationModal from './components/organisms/delete-confirmation-modal'
import { Product } from './types/inventory'

/**
 * Main application component that manages the inventory system UI
 * @returns The root application component
 */
function App(): JSX.Element {
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  /**
   * Opens the form modal for creating a new product
   */
  const handleAddProduct = (): void => {
    setProductToEdit(null)
    setIsFormModalOpen(true)
  }

  /**
   * Opens the form modal for editing an existing product
   * @param product - The product to edit
   */
  const handleEditProduct = (product: Product): void => {
    setProductToEdit(product)
    setIsFormModalOpen(true)
  }

  /**
   * Opens the delete confirmation modal for a product
   * @param product - The product to delete
   */
  const handleDeleteClick = (product: Product): void => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  /**
   * Closes the form modal
   */
  const handleCloseFormModal = (): void => {
    setIsFormModalOpen(false)
    setProductToEdit(null)
  }

  /**
   * Closes the delete confirmation modal
   */
  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false)
    setProductToDelete(null)
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pharmacy Inventory System</h1>
          <button
            onClick={handleAddProduct}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      </header>

      <main>
        <ProductList 
          onEdit={handleEditProduct} 
          onDelete={handleDeleteClick} 
        />
      </main>

      {isFormModalOpen && (
        <ProductFormModal 
          product={productToEdit} 
          isOpen={isFormModalOpen} 
          onClose={handleCloseFormModal} 
        />
      )}

      {isDeleteModalOpen && productToDelete && (
        <DeleteConfirmationModal 
          product={productToDelete} 
          isOpen={isDeleteModalOpen} 
          onClose={handleCloseDeleteModal} 
        />
      )}
    </div>
  )
}

export default App