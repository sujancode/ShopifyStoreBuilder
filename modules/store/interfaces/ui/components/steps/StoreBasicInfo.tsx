'use client';

import { useState, useEffect } from 'react';
import { Shirt, Headphones, PawPrint, Home, Dumbbell, ShoppingCart } from 'lucide-react';
import { useStoreStore } from '../../../../infrastructure/store/useStoreStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/modules/auth/infrastructure/store/useAuthStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface StoreBasicInfoProps {
  onComplete: () => void;
}

const niches = [
  {
    id: 'fashion',
    title: 'Fashion & Apparel',
    icon: Shirt,
    gradient: 'from-[#7C3AED] to-[#5B21B6]',
    description: 'Clothing, accessories, and style essentials'
  },
  {
    id: 'pets',
    title: 'Pets',
    icon: PawPrint,
    gradient: 'from-[#2563EB] to-[#1D4ED8]',
    description: 'Pet supplies, accessories, and care products'
  },
  {
    id: 'electronics',
    title: 'Electronics & Gadgets',
    icon: Headphones,
    gradient: 'from-[#059669] to-[#047857]',
    description: 'Tech gadgets, accessories, and smart devices'
  },
  {
    id: 'home',
    title: 'Home & Garden',
    icon: Home,
    gradient: 'from-[#D97706] to-[#B45309]',
    description: 'Home decor, furniture, and garden supplies'
  },
  {
    id: 'fitness',
    title: 'Sport & Fitness',
    icon: Dumbbell,
    gradient: 'from-[#7C3AED] to-[#6D28D9]',
    description: 'Sports equipment, fitness gear, and accessories'
  },
  {
    id: 'general',
    title: 'I\'m not sure',
    icon: ShoppingCart,
    gradient: 'from-[#4B5563] to-[#374151]',
    description: 'Get personalized recommendations from our AI'
  }
];

export function StoreBasicInfo({ onComplete }: StoreBasicInfoProps) {
  const { user } = useAuthStore();
  const { store, repository, setStore, setError, setCurrentStep } = useStoreStore();
  const [selectedNiche, setSelectedNiche] = useState(store?.config?.businessType || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [incompleteStore, setIncompleteStore] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeStore = async () => {
      if (!user) return;

      try {
        // Try to get existing store
        let currentStore = await repository.getStoreByUserId(user.id);

        // If no store exists, create a new one
        if (!currentStore) {
          currentStore = await repository.createStore(user.id, {
            storeName: `${user.email?.split('@')[0]}'s Store`,
            storeUrl: '',
            businessType: '',
            industry: '',
            banners: [],
            location: {
              country: 'US',
              currency: 'USD',
              timezone: 'UTC'
            }
          });
          toast({
            title: "Store Created",
            description: "Your store has been initialized successfully"
          });
        } else {
          // Check if store creation was incomplete
          if (currentStore.status === 'creating' || currentStore.status === 'draft') {
            setIncompleteStore(true);
            
            // Determine which step to resume from
            if (!currentStore.config.businessType) {
              setCurrentStep(0); // Start from niche selection
            } else if (!currentStore.config.banners.length) {
              setCurrentStep(1); // Resume from banner selection
            } else if (!currentStore.config.storeUrl) {
              setCurrentStep(3); // Resume from store URL setup
            }

            toast({
              title: "Incomplete Store Setup",
              description: "We found your previous progress. You can continue where you left off.",
            });
          }
        }

        setStore(currentStore);
        setSelectedNiche(currentStore.config.businessType);
      } catch (error) {
        setError((error as Error).message);
        toast({
          title: "Error",
          description: "Failed to initialize store",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeStore();
  }, [user, repository, setStore, setError, setCurrentStep, toast]);

  const handleNicheSelect = async (nicheId: string) => {
    try {
      setSelectedNiche(nicheId);
      if (store) {
        const updatedStore = await repository.updateStore(store.id, {
          ...store.config,
          businessType: nicheId,
          industry: niches.find(n => n.id === nicheId)?.title || ''
        });
        setStore(updatedStore);
      }
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Error",
        description: "Failed to update store niche",
        variant: "destructive"
      });
    }
  };

  const handleContinue = async () => {
    if (!selectedNiche) {
      toast({
        title: "Selection required",
        description: "Please select a niche for your store",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      if (store) {
        await repository.updateStore(store.id, {
          ...store.config,
          businessType: selectedNiche,
          industry: niches.find(n => n.id === selectedNiche)?.title || ''
        });
        onComplete();
      }
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Error",
        description: "Failed to save store niche",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {incompleteStore && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Welcome back! We've saved your progress. You can continue building your store from where you left off.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {niches.map((niche) => {
          const Icon = niche.icon;
          return (
            <button
              key={niche.id}
              onClick={() => handleNicheSelect(niche.id)}
              className={cn(
                'relative group p-6 rounded-xl transition-all duration-300',
                'hover:scale-102 hover:shadow-lg',
                selectedNiche === niche.id
                  ? `bg-gradient-to-br ${niche.gradient} text-white shadow-lg`
                  : 'bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100'
              )}
            >
              <div className="flex items-start space-x-4">
                <div className={cn(
                  'p-3 rounded-lg transition-colors',
                  selectedNiche === niche.id
                    ? 'bg-white/20'
                    : `bg-gradient-to-br ${niche.gradient} text-white`
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <h3 className={cn(
                    'font-medium text-lg mb-1',
                    selectedNiche === niche.id ? 'text-white' : 'text-gray-900'
                  )}>
                    {niche.title}
                  </h3>
                  <p className={cn(
                    'text-sm',
                    selectedNiche === niche.id ? 'text-white/90' : 'text-gray-500'
                  )}>
                    {niche.description}
                  </p>
                </div>
              </div>
              {selectedNiche === niche.id && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-white text-shopify-purple p-1 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedNiche && (
        <Button
          onClick={handleContinue}
          disabled={isUpdating}
          className="w-full mt-6 bg-shopify-purple hover:bg-shopify-purple/90"
        >
          {isUpdating ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            'Continue to Next Step'
          )}
        </Button>
      )}
    </div>
  );
}