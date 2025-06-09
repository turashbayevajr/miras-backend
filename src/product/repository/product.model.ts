export class Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ageGroupId: string;
  categoryId: string;
  brand?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
