import { create } from 'zustand';
import { Store, StoreConfig } from '../../core/entities/Store';
import { FirebaseStoreRepository } from '../repositories/FirebaseStoreRepository';

export const STORE_STEPS = [
  {
    id: 'store-niche',
    title: 'Choose Your Store Niche',
    description: 'Select the perfect niche for your store',
    warning: 'Changing your store niche will reset your current progress in this section.',
  },
  {
    id: 'banners',
    title: 'Choose Banners for Your Homepage',
    description: 'Select engaging banners for your store',
    warning: 'Changing your banner selection will reset your current banner choices.',
  },
  {
    id: 'shopify-account',
    title: 'Create Your Shopify Account',
    description: 'Set up your Shopify account credentials',
    warning: 'This will create your official Shopify store account.',
  },
  {
    id: 'link-store',
    title: 'Link Your Shopify Store',
    description: 'Connect your new Shopify store',
    warning: 'Make sure to complete the Shopify account creation first.',
  },
  {
    id: 'discount',
    title: 'Grab Your Shopify Discount',
    description: 'Get exclusive discounts for your store',
    warning: 'Ensure your store is properly linked before proceeding.',
  },
  {
    id: 'install-app',
    title: 'Install Build Your Store App',
    description: 'Add our app to enhance your store',
    warning: 'Required for AI-powered store customization.',
  },
  {
    id: 'customize',
    title: 'Make Your Store Unique',
    description: 'Customize your store design and settings',
    warning: 'Final customization step for your store.',
  },
] as const;

export const STORE_NICHES = [
  {
    id: 'fashion',
    title: 'Fashion & Apparel',
    gradient: 'from-[#7C3AED] to-[#5B21B6]',
    description: 'Clothing, accessories, and style essentials'
  },
  {
    id: 'pets',
    title: 'Pets',
    gradient: 'from-[#2563EB] to-[#1D4ED8]',
    description: 'Pet supplies, accessories, and care products'
  },
  {
    id: 'electronics',
    title: 'Electronics & Gadgets',
    gradient: 'from-[#059669] to-[#047857]',
    description: 'Tech gadgets, accessories, and smart devices'
  },
  {
    id: 'home',
    title: 'Home & Garden',
    gradient: 'from-[#D97706] to-[#B45309]',
    description: 'Home decor, furniture, and garden supplies'
  },
  {
    id: 'fitness',
    title: 'Sport & Fitness',
    gradient: 'from-[#7C3AED] to-[#6D28D9]',
    description: 'Sports equipment, fitness gear, and accessories'
  },
  {
    id: 'general',
    title: 'I\'m not sure',
    gradient: 'from-[#4B5563] to-[#374151]',
    description: 'Get personalized recommendations from our AI'
  }
] as const;

export const STORE_BANNERS = [
  {
    id: 'banner1',
    url: 'https://images.unsplash.com/photo-1591488320449-011012ff6e17',
    alt: 'Electronics and gadgets on blue background'
  },
  {
    id: 'banner2',
    url: 'https://images.unsplash.com/photo-1591489378430-ef2f4c626b35',
    alt: 'Gaming and tech devices on blue surface'
  },
  {
    id: 'banner3',
    url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a',
    alt: 'Drone delivery with packages'
  },
  {
    id: 'banner4',
    url: 'https://images.unsplash.com/photo-1591488320449-011012ff6e17',
    alt: 'Tech gadgets arranged on blue background'
  },
  {
    id: 'banner5',
    url: 'https://images.unsplash.com/photo-1591605548202-acf39e99ca78',
    alt: 'Electronics on dark background'
  },
  {
    id: 'banner6',
    url: 'https://images.unsplash.com/photo-1591489378430-ef2f4c626b35',
    alt: 'Modern tech setup on blue background'
  }
] as const;

interface StoreState {
  store: Store | null;
  loading: boolean;
  error: string | null;
  currentStep: number;
  completedSteps: string[];
  repository: FirebaseStoreRepository;
  setStore: (store: Store | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentStep: (step: number) => void;
  completeStep: (stepId: string) => void;
  isStepCompleted: (stepId: string) => boolean;
  resetStore: () => void;
  canProceedToStep: (stepIndex: number) => boolean;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  store: null,
  loading: false,
  error: null,
  currentStep: 0,
  completedSteps: [],
  repository: new FirebaseStoreRepository(),
  setStore: (store) => set({ store }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentStep: (step) => set({ currentStep: step }),
  completeStep: (stepId) => set((state) => ({
    completedSteps: [...new Set([...state.completedSteps, stepId])]
  })),
  isStepCompleted: (stepId) => get().completedSteps.includes(stepId),
  resetStore: () => set({ 
    store: null, 
    currentStep: 0, 
    error: null, 
    completedSteps: [] 
  }),
  canProceedToStep: (stepIndex) => {
    const state = get();
    if (stepIndex === 0) return true;
    const previousStep = STORE_STEPS[stepIndex - 1];
    return state.isStepCompleted(previousStep.id);
  },
}));