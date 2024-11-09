'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductTemplateForm } from '@/modules/product/interfaces/ui/components/ProductTemplateForm';
import { HtmlPreviewEditor } from '@/modules/product/interfaces/ui/components/HtmlPreviewEditor';
import { useProductStore } from '@/modules/product/infrastructure/store/useProductStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EditProductTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const { templates, loadTemplates, updateTemplate, loading } = useProductStore();
  const { toast } = useToast();
  const handle = params.handle as string;

  useEffect(() => {
    if (templates.length === 0) {
      loadTemplates();
    }
  }, [templates.length, loadTemplates]);

  const template = templates.find(t => t.handle === handle);

  const handleSubmit = async (data: any) => {
    try {
      await updateTemplate(handle, data);
      toast({
        title: 'Success',
        description: 'Template updated successfully',
      });
      router.push('/products');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };

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
          <h1 className="text-3xl font-bold">Edit Product Template</h1>
          <p className="text-muted-foreground mt-1">
            Update your product template details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductTemplateForm 
          initialData={template} 
          onSubmit={handleSubmit}
        />
        <div className="space-y-6">
          <HtmlPreviewEditor
            initialContent={template.body_html}
            onChange={(html) => {
              handleSubmit({ ...template, body_html: html });
            }}
          />
        </div>
      </div>
    </div>
  );
}