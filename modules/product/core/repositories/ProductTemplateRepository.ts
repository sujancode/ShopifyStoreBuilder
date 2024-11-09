import { ProductTemplate, GeneratedProduct } from '../types/product';

export interface ProductTemplateRepository {
  createTemplate(template: ProductTemplate): Promise<ProductTemplate>;
  getTemplate(id: string): Promise<ProductTemplate>;
  updateTemplate(handle: string, template: Partial<ProductTemplate>): Promise<ProductTemplate>;
  deleteTemplate(id: string): Promise<void>;
  listTemplates(): Promise<ProductTemplate[]>;
  
  generateProduct(templateId: string): Promise<GeneratedProduct>;
  getGeneratedProduct(id: string): Promise<GeneratedProduct>;
  listGeneratedProducts(templateId: string): Promise<GeneratedProduct[]>;
}