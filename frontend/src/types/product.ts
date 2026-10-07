export interface BulkPricing {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;

  category:
    | string
    | {
        _id: string;
        name: string;
      };

  brand?: string;

  images?: string[];

  basePrice: number;
  moq: number;
  unit: string;
  stock: number;

  bulkPricing: BulkPricing[];

  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}