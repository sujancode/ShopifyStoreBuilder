'use client';

import { useEffect, useState } from 'react';
import { useGenerationStore } from '../../../infrastructure/store/useGenerationStore';
import { useProductTypeStore } from '@/modules/product/infrastructure/store/useProductTypeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GeneratedProduct } from '../../../core/types/generation';
import { GeneratedProductCard } from './GeneratedProductCard';

interface GenerationHistoryProps {
  productTypeId?: string;
}

export function GenerationHistory({ productTypeId }: GenerationHistoryProps) {
  const { 
    history, 
    loadHistory, 
    deleteGeneration,
    getGeneratedProduct 
  } = useGenerationStore();
  const { types } = useProductTypeStore();
  const { toast } = useToast();
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [generatedProduct, setGeneratedProduct] = useState<GeneratedProduct | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory(productTypeId);
  }, [productTypeId, loadHistory]);

  const handleDelete = async (id: string) => {
    try {
      await deleteGeneration(id);
      toast({
        title: 'Success',
        description: 'Generation record deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };

  const handleToggleExpand = async (recordId: string, productId: string) => {
    if (expandedRecord === recordId) {
      setExpandedRecord(null);
      setGeneratedProduct(null);
      return;
    }

    setLoading(true);
    try {
      const product = await getGeneratedProduct(productId);
      setGeneratedProduct(product);
      setExpandedRecord(recordId);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load generated product',
      });
    } finally {
      setLoading(false);
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No generation history available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((record) => {
        const productType = types.find(t => t.id === record.settings.productTypeId)?.name || 'Unknown Type';
        const isExpanded = expandedRecord === record.id;
        
        return (
          <Card key={record.id}>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{productType}</Badge>
                      <Badge
                        variant={
                          record.status === 'completed'
                            ? 'success'
                            : record.status === 'failed'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generated on {record.createdAt.toLocaleDateString()}
                    </p>
                    {record.error && (
                      <p className="text-sm text-red-500 mt-1">{record.error}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {record.status === 'completed' && record.productId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleExpand(record.id, record.productId)}
                        disabled={loading}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        )}
                        {isExpanded ? 'Hide' : 'View'} Product
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isExpanded && generatedProduct && (
                  <div className="pt-4 border-t">
                    <GeneratedProductCard product={generatedProduct} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}