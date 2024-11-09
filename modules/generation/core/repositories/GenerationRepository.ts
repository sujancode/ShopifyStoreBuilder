import { GenerationSettings, GenerationResult, GeneratedProduct, ProductTemplate, ProductType } from '../types/generation';

export interface GenerationRepository {
  generateProduct(settings: GenerationSettings): Promise<GeneratedProduct>;
  getGenerationHistory(productTypeId?: string): Promise<GenerationResult[]>;
  deleteGeneration(id: string): Promise<void>;
  getProductTypes(): Promise<ProductType[]>;
  getProductTemplates(productTypeId?: string): Promise<ProductTemplate[]>;
  getGeneratedProduct(id: string): Promise<GeneratedProduct>;
  deleteGeneratedProduct(id: string): Promise<void>;
  listGeneratedProducts(productTypeId?: string): Promise<GeneratedProduct[]>;
}