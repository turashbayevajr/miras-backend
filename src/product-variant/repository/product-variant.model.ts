export class ProductVariant {
  id: string;
  productId: string;
  sizeId: string;
  colorId: string;
  price: number;
  stock: number;
  sku: string;
  deletedAt?: Date | null;
}
