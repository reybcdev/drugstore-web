import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePickerInput } from '@/components/ui/date-picker';
import type { Product, NewProduct } from '../../types/inventory';
import { inventoryApi } from '../../services/api';

interface ProductFormProps {
  readonly product?: Product | null;
  readonly onClose: () => void;
  readonly onSave: () => void;
}

/**
 * Product form organism component for creating and editing products
 */
const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState<NewProduct>({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    category: '',
    supplier: '',
    expiryDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      populateFormWithProduct(product);
    }
  }, [product]);

  /**
   * Populates form with existing product data
   */
  const populateFormWithProduct = (product: Product): void => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      category: product.category,
      supplier: product.supplier,
      expiryDate: formatDateForInput(product.expiryDate),
    });
  };

  /**
   * Formats date string for HTML date input
   */
  const formatDateForInput = (dateString: string): string => {
    return dateString.split('T')[0];
  };

  /**
   * Handles input field changes
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFieldValue(name, value)
    }));
  };

  /**
   * Parses field value based on field type
   */
  const parseFieldValue = (fieldName: string, value: string): string | number => {
    if (fieldName === 'price' || fieldName === 'stockQuantity') {
      return parseFloat(value) || 0;
    }
    return value;
  };

  /**
   * Validates form data
   */
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (formData.stockQuantity < 0) {
      setError('Stock quantity cannot be negative');
      return false;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return false;
    }
    if (!formData.supplier.trim()) {
      setError('Supplier is required');
      return false;
    }
    if (!formData.expiryDate) {
      setError('Expiry date is required');
      return false;
    }
    return true;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (product) {
        await updateExistingProduct();
      } else {
        await createNewProduct();
      }
      onSave();
      onClose();
    } catch (err) {
      handleSubmitError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates existing product
   */
  const updateExistingProduct = async (): Promise<void> => {
    if (!product) return;
    await inventoryApi.updateProduct(product.id, formData as Partial<Product>);
  };

  /**
   * Creates new product
   */
  const createNewProduct = async (): Promise<void> => {
    await inventoryApi.createProduct(formData);
  };

  /**
   * Handles submission errors
   */
  const handleSubmitError = (err: unknown): void => {
    console.error('Error saving product:', err);
    setError('Failed to save product. Please try again.');
  };

  /**
   * Renders form field
   */
  const renderFormField = (
    label: string,
    name: keyof NewProduct,
    type: string = 'text',
    required: boolean = true
  ) => {
    // Special case for date fields
    if (type === 'date') {
      return (
        <div>
          <Label htmlFor={name}>
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          <DatePickerInput
            value={formData[name] as string}
            onChange={(value) => 
              setFormData(prev => ({ ...prev, [name]: value }))
            }
            className="mt-1 w-full"
            placeholder="Select expiry date"
          />
        </div>
      );
    }
    
    // Regular input fields
    return (
      <div>
        <Label htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          required={required}
          className="mt-1"
        />
      </div>
    );
  };

  /**
   * Renders textarea field
   */
  const renderTextareaField = (
    label: string,
    name: keyof NewProduct,
    required: boolean = false
  ) => (
    <div>
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={formData[name] as string}
        onChange={handleInputChange}
        rows={3}
        className="mt-1"
      />
    </div>
  );

  /**
   * Renders error message
   */
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  };

  /**
   * Renders form actions
   */
  const renderFormActions = () => (
    <div className="flex justify-end space-x-3 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={loading}
        variant="default"
        className="flex items-center"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            {product ? 'Update Product' : 'Create Product'}
          </>
        )}
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {renderError()}

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormField('Product Name', 'name')}
          {renderTextareaField('Description', 'description')}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFormField('Price', 'price', 'number')}
            {renderFormField('Stock Quantity', 'stockQuantity', 'number')}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFormField('Category', 'category')}
            {renderFormField('Supplier', 'supplier')}
          </div>
          
          {renderFormField('Expiry Date', 'expiryDate', 'date')}
          
          {renderFormActions()}
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
