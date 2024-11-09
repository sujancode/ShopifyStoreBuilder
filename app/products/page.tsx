'use client';

import { useEffect } from 'react';
import { useProductStore } from '@/modules/product/infrastructure/store/useProductStore';
import { ProductTemplateList } from '@/modules/product/interfaces/ui/components/ProductTemplateList';
import { CreateTemplateButton } from '@/modules/product/interfaces/ui/components/CreateTemplateButton';
import { ImportExportButtons } from '@/modules/product/interfaces/ui/components/ImportExportButtons';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ProductsPage() {
  const { templates, loading, loadTemplates } = useProductStore();

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  if (loading && templates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Templates</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product templates and generate variations
          </p>
        </div>
        <div className="flex gap-4">
          <ImportExportButtons />
          <CreateTemplateButton />
        </div>
      </div>
      <ProductTemplateList />
    </div>
  );
}
