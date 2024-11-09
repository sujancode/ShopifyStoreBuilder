'use client';

import { useState, useEffect } from 'react';
import { useGenerationStore } from '@/modules/generation/infrastructure/store/useGenerationStore';
import { ProductTypeSelect } from '@/modules/generation/interfaces/ui/components/ProductTypeSelect';
import { GeneratedProductsList } from '@/modules/generation/interfaces/ui/components/GeneratedProductsList';
import { GenerationHistory } from '@/modules/generation/interfaces/ui/components/GenerationHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, History } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function GeneratePage() {
  const [selectedType, setSelectedType] = useState('');
  const { 
    generateProduct, 
    generatedProducts,
    loadGeneratedProducts,
    loading,
    loadProductTypes,
    productTypes
  } = useGenerationStore();
  const { toast } = useToast();

  useEffect(() => {
    loadProductTypes();
  }, [loadProductTypes]);

  useEffect(() => {
    if (selectedType) {
      loadGeneratedProducts(selectedType);
    }
  }, [selectedType, loadGeneratedProducts]);

  const handleGenerate = async () => {
    if (!selectedType) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a product type',
      });
      return;
    }

    try {
      await generateProduct({ productTypeId: selectedType });
      toast({
        title: 'Success',
        description: 'Product generated successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };

  const selectedTypeName = productTypes.find(t => t.id === selectedType)?.name;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Product Generation</h1>
        <p className="text-muted-foreground mt-1">
          Generate unique product variations using AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Generation Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Type</Label>
              <ProductTypeSelect
                value={selectedType}
                onChange={setSelectedType}
                disabled={loading}
              />
              {selectedTypeName && (
                <p className="text-sm text-muted-foreground">
                  Selected type: {selectedTypeName}
                </p>
              )}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !selectedType}
              className="w-full"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Product
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Tabs defaultValue="products">
                <TabsList>
                  <TabsTrigger value="products">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generated Products
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="products">
                <TabsContent value="products">
                  <GeneratedProductsList products={generatedProducts} />
                </TabsContent>
                <TabsContent value="history">
                  <GenerationHistory productTypeId={selectedType} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}