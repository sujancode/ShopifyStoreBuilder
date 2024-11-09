'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Box, Zap } from 'lucide-react';

interface InstallBuildAppProps {
  onComplete: () => void;
}

export function InstallBuildApp({ onComplete }: InstallBuildAppProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-shopify-purple/10 rounded-lg">
            <Box className="w-6 h-6 text-shopify-purple" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Build Your Store App</h3>
            <p className="text-muted-foreground mb-4">
              Our app helps you customize and manage your store with AI-powered features
            </p>
            <ul className="space-y-3">
              {[
                'AI-powered product recommendations',
                'Smart inventory management',
                'Automated marketing campaigns',
                'Sales analytics and insights'
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-shopify-purple" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        <Button
          className="w-full"
          onClick={() => window.open('https://apps.shopify.com', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Install App
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onComplete}
        >
          I've Installed the App
        </Button>
      </div>
    </div>
  );
}