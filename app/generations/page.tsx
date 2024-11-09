'use client';

import { useEffect } from 'react';
import { useGenerationStore } from '@/modules/generation/infrastructure/store/useGenerationStore';
import { GenerationList } from '@/modules/generation/interfaces/ui/components/GenerationList';
import { GenerationFilters } from '@/modules/generation/interfaces/ui/components/GenerationFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function GenerationsPage() {
  const { loadGeneratedProducts, loadProductTypes } = useGenerationStore();

  useEffect(() => {
    loadGeneratedProducts();
    loadProductTypes();
  }, [loadGeneratedProducts, loadProductTypes]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Generated Products</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your AI-generated products
          </p>
        </div>
        <Button asChild>
          <Link href="/generate">
            <Plus className="w-4 h-4 mr-2" />
            Generate New
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <GenerationFilters />
        <GenerationList />
      </div>
    </div>
  );
}