import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../services/api';
import type { Product, NewProduct } from '../types/inventory';
import { useInventoryStore } from '../stores/inventory-store';

const QUERY_KEYS = {
  products: ['products'] as const,
  product: (id: number) => ['products', id] as const,
  lowStock: ['products', 'low-stock'] as const,
  expiring: ['products', 'expiring'] as const,
} as const;

export const useProducts = () => {
  const { filters } = useInventoryStore();
  
  return useQuery({
    queryKey: [...QUERY_KEYS.products, filters],
    queryFn: async () => {
      if (filters.lowStock) {
        return inventoryApi.getLowStockProducts();
      }
      if (filters.expiringSoon) {
        return inventoryApi.getExpiringProducts();
      }
      
      // Apply client-side filters
      let filteredProducts = await inventoryApi.getProducts();
      
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }
      
      if (filters.supplier) {
        filteredProducts = filteredProducts.filter(p => 
          p.supplier.toLowerCase().includes(filters.supplier!.toLowerCase())
        );
      }
      
      return filteredProducts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => inventoryApi.getProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { closeForm } = useInventoryStore();
  
  return useMutation({
    mutationFn: (product: NewProduct) => inventoryApi.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      closeForm();
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { closeForm } = useInventoryStore();
  
  return useMutation({
    mutationFn: ({ id, product }: { id: number; product: Partial<Product> }) => 
      inventoryApi.updateProduct(id, product),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.product(id) });
      closeForm();
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { closeDeleteDialog } = useInventoryStore();
  
  return useMutation({
    mutationFn: (id: number) => inventoryApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products });
      closeDeleteDialog();
    },
  });
};
