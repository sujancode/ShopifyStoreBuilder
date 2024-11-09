'use client';

import { GeneratedProduct } from '../../../core/types/generation';
import { useGenerationStore } from '../../../infrastructure/store/useGenerationStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface GeneratedProductsListProps {
  products: GeneratedProduct[];
}

export function GeneratedProductsList({ products }: GeneratedProductsListProps) {
  const { productTypes } = useGenerationStore();

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No product variations generated yet. Use the generate button to create variations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map((product) => {
        const productType = productTypes.find(t => t.id === product.product_type_id)?.name || 'Unknown Type';
        const basePrice = product.variants[0]?.price || '0';

        return (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{productType}</Badge>
                    <Badge variant="secondary">{formatCurrency(Number(basePrice))}</Badge>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  New
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {product.selected_meta.main_description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {product.images.slice(0, 2).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>

                {product.selected_meta.image_text_sections.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">Features</h4>
                    <div className="space-y-2">
                      {product.selected_meta.image_text_sections.map((section, index) => (
                        <div key={index}>
                          <h5 className="font-medium text-sm">{section.title}</h5>
                          <p className="text-sm text-muted-foreground">
                            {section.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.selected_meta.qa_sections.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">FAQ</h4>
                    <div className="space-y-2">
                      {product.selected_meta.qa_sections.map((qa, index) => (
                        <div key={index}>
                          <h5 className="font-medium text-sm">{qa.question}</h5>
                          <p className="text-sm text-muted-foreground">
                            {qa.answer}
                          </p>
                        </div>
                      ))}
                    </div>
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