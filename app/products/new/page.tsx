'use client';

import { ProductTemplateForm } from '@/modules/product/interfaces/ui/components/ProductTemplateForm';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useProductStore } from '@/modules/product/infrastructure/store/useProductStore';

export default function NewProductTemplatePage() {
  const router = useRouter();
  const { createTemplate } = useProductStore();
  const { toast } = useToast();

  const handleSubmit = async (template: any) => {
    try {
      await createTemplate(template);
      toast({
        title: 'Success',
        description: 'Template created successfully',
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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Product Template</h1>
        <p className="text-muted-foreground mt-1">
          Create a new product template for generating variations
        </p>
      </div>
      <ProductTemplateForm onSubmit={handleSubmit} />
    </div>
  );
}