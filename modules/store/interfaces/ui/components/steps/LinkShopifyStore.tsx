'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useStoreStore } from '@/modules/store/infrastructure/store/useStoreStore';

interface LinkShopifyStoreProps {
  onComplete: () => void;
}

export function LinkShopifyStore({ onComplete }: LinkShopifyStoreProps) {
  const [storeUrl, setStoreUrl] = useState('');
  const { store, repository, setStore } = useStoreStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Shopify store URL",
        variant: "destructive"
      });
      return;
    }

    try {
      if (store) {
        await repository.updateStore(store.id, {
          ...store.config,
          storeUrl
        });
        toast({
          title: "Success",
          description: "Store URL linked successfully"
        });
        onComplete();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to link store URL",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="store-url">Your Shopify Store URL</Label>
          <Input
            id="store-url"
            placeholder="mystore.myshopify.com"
            value={storeUrl}
            onChange={(e) => setStoreUrl(e.target.value)}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Enter your Shopify store URL to connect it with our platform
        </p>
      </div>

      <Button type="submit" className="w-full">
        Link Store and Continue
      </Button>
    </form>
  );
}