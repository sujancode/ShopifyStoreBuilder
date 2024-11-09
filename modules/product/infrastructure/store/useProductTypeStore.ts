import { create } from 'zustand';
import { ProductType } from '../../core/types/product';
import { FirebaseProductTypeRepository } from '../repositories/FirebaseProductTypeRepository';

interface ProductTypeState {
  types: ProductType[];
  loading: boolean;
  error: string | null;
  repository: FirebaseProductTypeRepository;
  
  loadTypes: () => Promise<void>;
  createType: (name: string, description?: string) => Promise<void>;
  updateType: (id: string, data: Partial<ProductType>) => Promise<void>;
  deleteType: (id: string) => Promise<void>;
}

export const useProductTypeStore = create<ProductTypeState>((set, get) => ({
  types: [],
  loading: false,
  error: null,
  repository: new FirebaseProductTypeRepository(),

  loadTypes: async () => {
    set({ loading: true, error: null });
    try {
      const types = await get().repository.listTypes();
      set({ types, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  createType: async (name: string, description?: string) => {
    set({ loading: true, error: null });
    try {
      await get().repository.createType({ name, description });
      await get().loadTypes();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateType: async (id: string, data: Partial<ProductType>) => {
    set({ loading: true, error: null });
    try {
      await get().repository.updateType(id, data);
      await get().loadTypes();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteType: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await get().repository.deleteType(id);
      await get().loadTypes();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));