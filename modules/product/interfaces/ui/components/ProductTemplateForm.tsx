'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MetaVariationsForm } from './MetaVariationsForm';
import { VariantsForm } from './VariantsForm';
import { ImageUpload } from './ImageUpload';
import { ProductTypeSelect } from './ProductTypeSelect';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductTemplate } from '@/modules/product/core/types/product';
import { useProductTypeStore } from '@/modules/product/infrastructure/store/useProductTypeStore';

const templateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  handle: z.string().min(1, 'Handle is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  product_type_id: z.string().min(1, 'Product type is required'),
  body_html: z.string(),
  tags: z.string(),
  images: z.array(z.string()),
  variants: z.array(z.any()),
  meta_variations: z.object({
    product_main_description: z.array(z.string()),
    image_with_text_sections: z.array(z.object({
      title_variations: z.array(z.string()),
      description_variations: z.array(z.string()),
    })),
    collapsible_qa_sections: z.array(z.object({
      question: z.string(),
      answer_variations: z.array(z.string()),
    })),
    brandable_title_variations: z.array(z.string()),
  }),
});

interface ProductTemplateFormProps {
  initialData?: ProductTemplate;
  onSubmit: (data: ProductTemplate) => Promise<void>;
}

export function ProductTemplateForm({ initialData, onSubmit }: ProductTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metaFileError, setMetaFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { loadTypes } = useProductTypeStore();
  
  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  const form = useForm<ProductTemplate>({
    resolver: zodResolver(templateSchema),
    defaultValues: initialData || {
      title: '',
      handle: '',
      vendor: '',
      product_type_id: '',
      body_html: '',
      tags: '',
      images: [],
      variants: [],
      meta_variations: {
        product_main_description: [''],
        image_with_text_sections: [],
        collapsible_qa_sections: [],
        brandable_title_variations: [],
      },
    },
  });

  const handleMetaFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setMetaFileError('Please select a JSON file');
      return;
    }

    try {
      const content = await file.text();
      const metaData = JSON.parse(content);

      // Validate the structure of the uploaded meta variations
      if (!metaData.product_main_description || !Array.isArray(metaData.product_main_description)) {
        throw new Error('Invalid meta variations format: missing or invalid product_main_description');
      }

      form.setValue('meta_variations', metaData);
      setMetaFileError(null);
      toast({
        title: 'Success',
        description: 'Meta variations uploaded successfully',
      });
    } catch (error) {
      setMetaFileError((error as Error).message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to parse meta variations file',
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (data: ProductTemplate) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="handle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Handle</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="product_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <FormControl>
                      <ProductTypeSelect
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="body_html"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (HTML)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="tag1, tag2, tag3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <ImageUpload
          images={form.watch('images')}
          onChange={(images) => form.setValue('images', images)}
        />

        <VariantsForm
          variants={form.watch('variants')}
          onChange={(variants) => form.setValue('variants', variants)}
        />

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Meta Variations</Label>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleMetaFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleChooseFile}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Meta File
                  </Button>
                </div>
              </div>

              {metaFileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{metaFileError}</AlertDescription>
                </Alert>
              )}

              <MetaVariationsForm
                value={form.watch('meta_variations')}
                onChange={(meta) => form.setValue('meta_variations', meta)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
            {initialData ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Form>
  );
}