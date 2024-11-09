'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/modules/product/infrastructure/store/useProductStore';
import { ProductTemplateDetail } from '@/modules/product/interfaces/ui/components/ProductTemplateDetail';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function ProductTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const { templates, loadTemplates, loading } = useProductStore();
  const handle = params.handle as string;

  useEffect(() => {
    if (templates.length === 0) {
      loadTemplates();
    }
  }, [templates.length, loadTemplates]);

  const template = templates.find(t => t.handle === handle);

  if (loading || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{template.title}</h1>
          <p className="text-muted-foreground mt-1">
            Product template details and preview
          </p>
        </div>
      </div>
      
      <ProductTemplateDetail template={template} />
    </div>
  );
}