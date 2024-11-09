'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGenerationStore } from '../../../infrastructure/store/useGenerationStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Eye, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function GenerationList() {
  const { generatedProducts, productTypes, deleteGeneratedProduct, loading } = useGenerationStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteGeneratedProduct(deletingId);
      toast({
        title: 'Success',
        description: 'Generated product deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete generated product',
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!generatedProducts || generatedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No generated products found. Start by generating new products.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/generate">Generate New Product</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {generatedProducts.map((product) => {
        if (!product) return null;

        const productType = productTypes?.find(t => t.id === product.product_type_id)?.name || 'Unknown Type';
        const basePrice = product.variants?.[0]?.price || '0';
        const mainImage = product.images?.[0];

        return (
          <Card key={product.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {mainImage && (
                    <img
                      src={mainImage}
                      alt={product.title || 'Product image'}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{product.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{productType}</Badge>
                        <Badge variant="secondary">
                          {formatCurrency(Number(basePrice))}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {product.selected_meta?.main_description || 'No description available'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/generations/${product.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingId(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              generated product and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}