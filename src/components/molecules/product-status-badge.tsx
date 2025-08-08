import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { isLowStock, isExpiringSoon } from '@/lib/utils.ts';
import type { Product } from '@/types/inventory.ts';

interface ProductStatusBadgeProps {
  readonly product: Product;
}

export const ProductStatusBadge = ({ product }: ProductStatusBadgeProps) => {
  const lowStock = isLowStock(product.stockQuantity);
  const expiringSoon = isExpiringSoon(product.expiryDate);

  if (lowStock && expiringSoon) {
    return (
      <div className="flex gap-1">
        <Badge 
          variant="destructive"
          className="flex items-center gap-1"
        >
          <AlertTriangle className="h-3 w-3" />
          Low Stock
        </Badge>
        <Badge 
          variant="destructive"
          className="flex items-center gap-1"
        >
          <AlertTriangle className="h-3 w-3" />
          Expiring Soon
        </Badge>
      </div>
    );
  }

  if (lowStock) {
    return (
      <Badge 
        variant="destructive"
        className="flex items-center gap-1"
      >
        <AlertTriangle className="h-3 w-3" />
        Low Stock
      </Badge>
    );
  }

  if (expiringSoon) {
    return (
      <Badge 
        variant="destructive"
        className="flex items-center gap-1"
      >
        <AlertTriangle className="h-3 w-3" />
        Expiring Soon
      </Badge>
    );
  }

  return (
    <Badge variant="secondary">
      In Stock
    </Badge>
  );
};
