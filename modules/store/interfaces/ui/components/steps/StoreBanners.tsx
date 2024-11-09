'use client';

import { useState } from 'react';
import { useStoreStore } from '../../../../infrastructure/store/useStoreStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const banners = [
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
];
interface StoreBasicInfoProps {
  onComplete: () => void;
}

export function StoreBanners({onComplete}:StoreBasicInfoProps) {
  const { store, repository, setStore, setError } = useStoreStore();
  const [selectedBanners, setSelectedBanners] = useState<string[]>(
    store?.config?.banners || []
  );
  const { toast } = useToast();

  const toggleBanner = (bannerId: string) => {
    setSelectedBanners(current => {
      if (current.includes(bannerId)) {
        return current.filter(id => id !== bannerId);
      }
      if (current.length >= 2) {
        toast({
          title: "Maximum selection reached",
          description: "Please select only two banners",
          variant: "destructive"
        });
        return current;
      }
      return [...current, bannerId];
    });
  };

  const handleUpdate = async () => {
    if (selectedBanners.length !== 2) {
      toast({
        title: "Invalid selection",
        description: "Please select exactly two banners",
        variant: "destructive"
      });
      return;
    }

    try {
      if (store) {
        const updatedStore = await repository.updateStore(store.id, {
          ...store.config,
          banners: selectedBanners
        });
        setStore(updatedStore);
        onComplete()
        toast({
          title: "Success",
          description: "Banner selection updated successfully"
        });
      }
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: "Error",
        description: "Failed to update banner selection",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium mb-2">
          We've designed 6 banner options for your homepage
        </h3>
        <p className="text-muted-foreground">
          Please select two, and we'll add them to your store's homepage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner) => (
          <button
            key={banner.id}
            onClick={() => toggleBanner(banner.id)}
            className={cn(
              'relative group rounded-xl overflow-hidden transition-all duration-300',
              'aspect-[16/9] border-2',
              selectedBanners.includes(banner.id)
                ? 'border-shopify-purple shadow-lg'
                : 'border-transparent hover:border-shopify-purple/50'
            )}
          >
            <img
              src={banner.url}
              alt={banner.alt}
              className="w-full h-full object-cover"
            />
            {selectedBanners.includes(banner.id) && (
              <div className="absolute inset-0 bg-shopify-purple/10 flex items-center justify-center">
                <div className="bg-white rounded-full p-2">
                  <Check className="w-6 h-6 text-shopify-purple" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <Button
        onClick={handleUpdate}
        disabled={selectedBanners.length !== 2}
        className="w-full mt-6 bg-shopify-purple hover:bg-shopify-purple/90"
      >
        Update Banner Selection
      </Button>
    </div>
  );
}