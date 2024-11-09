import { create } from 'zustand';
import { ProductTemplate, GeneratedProduct } from '../../core/types/product';
import { FirebaseProductTemplateRepository } from '../repositories/FirebaseProductTemplateRepository';
import { validateTemplate } from '../../interfaces/ui/utils/templateValidation';

interface ProductState {
  templates: ProductTemplate[];
  currentTemplate: ProductTemplate | null;
  generatedProducts: GeneratedProduct[];
  loading: boolean;
  error: string | null;
  repository: FirebaseProductTemplateRepository;
  
  loadTemplates: () => Promise<void>;
  createTemplate: (template: ProductTemplate) => Promise<void>;
  updateTemplate: (handle: string, template: Partial<ProductTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  generateProduct: (templateId: string) => Promise<void>;
  loadGeneratedProducts: (templateId: string) => Promise<void>;
  importTemplates: (templates: ProductTemplate[]) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  templates: [],
  currentTemplate: null,
  generatedProducts: [],
  loading: false,
  error: null,
  repository: new FirebaseProductTemplateRepository(),

  loadTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const templates = await get().repository.listTemplates();
      set({ templates, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createTemplate: async (template: ProductTemplate) => {
    set({ loading: true, error: null });
    try {
      const validation = validateTemplate(template);
      if (!validation.isValid) {
        throw new Error(`Invalid template: ${validation.errors.join(', ')}`);
      }
      await get().repository.createTemplate(template);
      await get().loadTemplates();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateTemplate: async (handle: string, template: Partial<ProductTemplate>) => {
    set({ loading: true, error: null });
    try {
      await get().repository.updateTemplate(handle, template);
      await get().loadTemplates();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteTemplate: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await get().repository.deleteTemplate(id);
      set(state => ({
        templates: state.templates.filter(t => t.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  generateProduct: async (templateId: string) => {
    set({ loading: true, error: null });
    try {
      await get().repository.generateProduct(templateId);
      await get().loadGeneratedProducts(templateId);
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  loadGeneratedProducts: async (templateId: string) => {
    set({ loading: true, error: null });
    try {
      const products = await get().repository.listGeneratedProducts(templateId);
      set({ generatedProducts: products, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  importTemplates: async (templates: ProductTemplate[]) => {
    set({ loading: true, error: null });
    try {
      // Validate all templates first
      const validationErrors: string[] = [];
      templates.forEach((template, index) => {
        const validation = validateTemplate(template);
        if (!validation.isValid) {
          validationErrors.push(`Template ${index + 1}: ${validation.errors.join(', ')}`);
        }
      });

      if (validationErrors.length > 0) {
        throw new Error(`Validation errors:\n${validationErrors.join('\n')}`);
      }

      // Get existing templates for deduplication
      const existingTemplates = await get().repository.listTemplates();
      const existingHandles = new Set(existingTemplates.map(t => t.handle));

      // Process templates sequentially
      for (const template of templates) {
        if (existingHandles.has(template.handle)) {
          // Update existing template
          await get().repository.updateTemplate(template.handle, template);
        } else {
          // Create new template
          await get().repository.createTemplate(template);
        }
      }

      // Reload templates after import
      await get().loadTemplates();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));