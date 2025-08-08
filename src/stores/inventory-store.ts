import { create } from 'zustand';
import type { Product, ProductFiltersOptions } from '../types/inventory';

interface InventoryState {
  products: Product[];
  filters: ProductFiltersOptions;
  isLoading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  isFormOpen: boolean;
  isDeleteDialogOpen: boolean;
  productToDelete: number | null;
}

interface InventoryActions {
  setProducts: (products: Product[]) => void;
  setFilters: (filters: ProductFiltersOptions) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedProduct: (product: Product | null) => void;
  openForm: (product?: Product) => void;
  closeForm: () => void;
  openDeleteDialog: (productId: number) => void;
  closeDeleteDialog: () => void;
  clearFilters: () => void;
}

type InventoryStore = InventoryState & InventoryActions;

export const useInventoryStore = create<InventoryStore>((set) => ({
  // State
  products: [],
  filters: {},
  isLoading: false,
  error: null,
  selectedProduct: null,
  isFormOpen: false,
  isDeleteDialogOpen: false,
  productToDelete: null,

  // Actions
  setProducts: (products) => set({ products }),
  setFilters: (filters) => set({ filters }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedProduct: (selectedProduct) => set({ selectedProduct }),
  
  openForm: (product) => set({ 
    isFormOpen: true, 
    selectedProduct: product || null 
  }),
  
  closeForm: () => set({ 
    isFormOpen: false, 
    selectedProduct: null 
  }),
  
  openDeleteDialog: (productId) => set({ 
    isDeleteDialogOpen: true, 
    productToDelete: productId 
  }),
  
  closeDeleteDialog: () => set({ 
    isDeleteDialogOpen: false, 
    productToDelete: null 
  }),
  
  clearFilters: () => set({ filters: {} }),
}));
