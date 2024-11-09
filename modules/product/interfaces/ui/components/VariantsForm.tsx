'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Minus } from 'lucide-react';
import { ProductVariant } from '@/modules/product/core/types/product';

interface VariantsFormProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

export function VariantsForm({ variants, onChange }: VariantsFormProps) {
  const addVariant = () => {
    onChange([
      ...variants,
      {
        price: '',
        position: variants.length + 1,
        option1: null,
        option2: null,
        option3: null,
        fulfillment_service: 'manual',
        inventory_management: 'shopify',
        requires_shipping: true,
        sku: '',
        inventory_quantity: 0,
      },
    ]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value,
    };
    onChange(newVariants);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {variants.map((variant, index) => (
          <div key={index} className="space-y-4 border-b pb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, 'price', e.target.value)}
                  placeholder="Enter price"
                />
              </div>

              <div>
                <Label>SKU</Label>
                <Input
                  value={variant.sku}
                  onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                  placeholder="Enter SKU"
                />
              </div>

              <div>
                <Label>Option 1</Label>
                <Input
                  value={variant.option1 || ''}
                  onChange={(e) => updateVariant(index, 'option1', e.target.value)}
                  placeholder="Enter option 1"
                />
              </div>

              <div>
                <Label>Option 2</Label>
                <Input
                  value={variant.option2 || ''}
                  onChange={(e) => updateVariant(index, 'option2', e.target.value)}
                  placeholder="Enter option 2"
                />
              </div>

              <div>
                <Label>Option 3</Label>
                <Input
                  value={variant.option3 || ''}
                  onChange={(e) => updateVariant(index, 'option3', e.target.value)}
                  placeholder="Enter option 3"
                />
              </div>

              <div>
                <Label>Inventory Quantity</Label>
                <Input
                  type="number"
                  value={variant.inventory_quantity}
                  onChange={(e) =>
                    updateVariant(index, 'inventory_quantity', parseInt(e.target.value))
                  }
                  placeholder="Enter quantity"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={variant.requires_shipping}
                  onCheckedChange={(checked) =>
                    updateVariant(index, 'requires_shipping', checked)
                  }
                />
                <Label>Requires Shipping</Label>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeVariant(index)}
              >
                <Minus className="h-4 w-4 mr-2" />
                Remove Variant
              </Button>
            </div>
          </div>
        ))}

        <Button type="button" onClick={addVariant}>
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </CardContent>
    </Card>
  );
}