'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface CreateShopifyAccountProps {
  onComplete: () => void;
}

export function CreateShopifyAccount({ onComplete }: CreateShopifyAccountProps) {
  const [hasVisitedShopify, setHasVisitedShopify] = useState(false);

  const handleShopifyAccess = () => {
    window.open('https://shopify.com', '_blank');
    setHasVisitedShopify(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-shopify-purple text-white text-sm">
              1
            </span>
            <p className="text-lg">
              Click <span className="font-semibold">"Access Shopify"</span> at the bottom of this screen to open the Shopify site in a new tab
            </p>
          </div>
        </div>

        <Card className="overflow-hidden border-2 border-dashed p-1">
          <Image
            src="https://images.unsplash.com/photo-1591488320449-011012ff6e17"
            alt="Shopify signup page"
            width={800}
            height={400}
            className="w-full rounded-lg"
          />
        </Card>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-shopify-purple text-white text-sm">
              2
            </span>
            <p className="text-lg">Enter your email in the provided field</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-shopify-purple text-white text-sm">
              3
            </span>
            <p className="text-lg">Quickly sign up for Shopify</p>
          </div>
          <div className="flex items-start gap-2 ml-8">
            <span className="text-yellow-400 text-xl">⭐</span>
            <p className="text-lg">
              <span className="font-semibold">QUICK TIP:</span> Skip the initial questions by clicking{" "}
              <span className="font-semibold">"Skip All"</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-shopify-purple text-white text-sm">
              4
            </span>
            <p className="text-lg">
              Return to this tab and hit the <span className="font-semibold">"Continue"</span> button to keep building your professional Shopify store!
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-6">
        <Button
          className="w-full bg-black hover:bg-black/90 text-white"
          onClick={handleShopifyAccess}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Access Shopify
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onComplete}
          disabled={!hasVisitedShopify}
        >
          Continue to Next Step
        </Button>
      </div>
    </div>
  );
}