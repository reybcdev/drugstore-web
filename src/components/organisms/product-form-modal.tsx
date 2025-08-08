import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePickerInput } from '@/components/ui/date-picker';
import { productSchema, type ProductFormData } from '@/schemas/product-schema.ts';
import { useInventoryStore } from '@/stores/inventory-store.ts';
import { useCreateProduct, useUpdateProduct } from '@/hooks/use-inventory.ts';
import type { Product } from '@/types/inventory.ts';

interface ProductFormModalProps {
  readonly product?: Product | null;
}

export const ProductFormModal = ({ product }: ProductFormModalProps) => {
  const { closeForm } = useInventoryStore();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || '',
          price: product.price,
          stockQuantity: product.stockQuantity,
          category: product.category,
          supplier: product.supplier,
          expiryDate: product.expiryDate,
        }
      : undefined,
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        await updateProductMutation.mutateAsync({
          id: product.id,
          product: {
            name: data.name,
            description: data.description || '',
            price: data.price,
            stockQuantity: data.stockQuantity,
            category: data.category,
            supplier: data.supplier,
            expiryDate: data.expiryDate,
          },
        });
      } else {
        await createProductMutation.mutateAsync({
          name: data.name,
          description: data.description || '',
          price: data.price,
          stockQuantity: data.stockQuantity,
          category: data.category,
          supplier: data.supplier,
          expiryDate: data.expiryDate,
        });
      }
      reset();
      closeForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleClose = () => {
    reset();
    closeForm();
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register('name')}
              className="mt-1"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              className="mt-1"
              rows={3}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="mt-1"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div className="flex-1">
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input
                id="stockQuantity"
                type="number"
                {...register('stockQuantity', { valueAsNumber: true })}
                className="mt-1"
                placeholder="0"
              />
              {errors.stockQuantity && (
                <p className="text-red-600 text-sm mt-1">{errors.stockQuantity.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              {...register('category')}
              className="mt-1"
              placeholder="e.g., Antibiotics, Vitamins"
            />
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="supplier">Supplier *</Label>
            <Input
              id="supplier"
              {...register('supplier')}
              className="mt-1"
              placeholder="Enter supplier name"
            />
            {errors.supplier && (
              <p className="text-red-600 text-sm mt-1">{errors.supplier.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <DatePickerInput
              value={watch('expiryDate') || ''}
              onChange={(date) => {
                setValue('expiryDate', date, { 
                  shouldValidate: true,
                  shouldDirty: true 
                });
              }}
              className="mt-1 w-full"
              placeholder="Select expiry date"
            />
            {errors.expiryDate && (
              <p className="text-red-600 text-sm mt-1">{errors.expiryDate.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : product ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
