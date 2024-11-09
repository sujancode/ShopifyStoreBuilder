import { ProductType } from '../types/product';

export interface ProductTypeRepository {
  createType(type: Omit<ProductType, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductType>;
  getType(id: string): Promise<ProductType>;
  updateType(id: string, type: Partial<ProductType>): Promise<ProductType>;
  deleteType(id: string): Promise<void>;
  listTypes(): Promise<ProductType[]>;
}