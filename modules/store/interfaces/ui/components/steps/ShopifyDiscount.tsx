'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gift, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShopifyDiscountProps {
  onComplete: () => void;
}

export function ShopifyDiscount({ onComplete }: ShopifyDiscountProps) {
  const { toast } = useToast();
  const discountCode = 'AISTORE50OFF';

  const copyDiscountCode = () => {
    navigator.clipboard.writeText(discountCode);
    toast({
      title: "Copied!",
      description: "Discount code copied to clipboard"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-shopify-purple to-shopify-indigo text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">Special Offer!</h3>
            <p className="text-white/90">Get 50% off your first 3 months</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white/10 rounded-lg flex items-center justify-between">
          <code className="text-xl font-mono font-bold">{discountCode}</code>
          <Button
            variant="secondary"
            size="sm"
            onClick={copyDiscountCode}
            className="bg-white text-shopify-purple hover:bg-white/90"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
      </Card>

      <Button onClick={onComplete} className="w-full">
        Continue to Next Step
      </Button>
    </div>
  );
}