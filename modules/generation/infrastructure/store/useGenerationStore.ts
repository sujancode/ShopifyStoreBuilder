import { create } from 'zustand';
import { ProductType } from '@/modules/product/core/types/product';
import { FirebaseGenerationRepository } from '../repositories/FirebaseGenerationRepository';
import { GenerationSettings } from '../../core/types/generation';

interface GenerationState {
  generatedProducts: any[];
  productTypes: ProductType[];
  loading: boolean;
  error: string | null;
  repository: FirebaseGenerationRepository;
  
  generateProduct: (settings: GenerationSettings) => Promise<void>;
  loadGeneratedProducts: (productTypeId?: string) => Promise<void>;
  loadProductTypes: () => Promise<void>;
  getGeneratedProduct: (id: string) => Promise<any>;
  deleteGeneratedProduct: (id: string) => Promise<void>;
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
  generatedProducts: [],
  productTypes: [],
  loading: false,
  error: null,
  repository: new FirebaseGenerationRepository(),

  generateProduct: async (settings: GenerationSettings) => {
    set({ loading: true, error: null });
    try {
      const product = await get().repository.generateProduct(settings);
      set(state => ({
        generatedProducts: [product, ...state.generatedProducts],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  loadGeneratedProducts: async (productTypeId?: string) => {
    set({ loading: true, error: null });
    try {
      const products = await get().repository.listGeneratedProducts(productTypeId);
      set({ generatedProducts: products, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  loadProductTypes: async () => {
    try {
      const types = await get().repository.listProductTypes();
      set({ productTypes: types });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  getGeneratedProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const product = await get().repository.getGeneratedProduct(id);
      set({ loading: false });
      return product;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteGeneratedProduct: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await get().repository.deleteGeneratedProduct(id);
      set(state => ({
        generatedProducts: state.generatedProducts.filter(p => p.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));