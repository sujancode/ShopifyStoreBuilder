'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Paintbrush, Layout, Type, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomizeStoreProps {
  onComplete: () => void;
}

export function CustomizeStore({ onComplete }: CustomizeStoreProps) {
  const [customizing, setCustomizing] = useState(false);
  const { toast } = useToast();

  const handleCustomize = async () => {
    setCustomizing(true);
    try {
      // Simulate AI customization process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Success",
        description: "Your store has been customized successfully!"
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to customize store",
        variant: "destructive"
      });
    } finally {
      setCustomizing(false);
    }
  };

  const customizationAreas = [
    {
      icon: Layout,
      title: 'Layout Optimization',
      description: 'AI-optimized layout for better conversion'
    },
    {
      icon: Type,
      title: 'Content Enhancement',
      description: 'Professional copy and descriptions'
    },
    {
      icon: ImageIcon,
      title: 'Visual Styling',
      description: 'Cohesive visual identity and branding'
    },
    {
      icon: Paintbrush,
      title: 'Color Scheme',
      description: 'Niche-appropriate color palette'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customizationAreas.map((area, index) => {
          const Icon = area.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-shopify-purple/10 rounded-lg">
                  <Icon className="w-5 h-5 text-shopify-purple" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{area.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {area.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Button
        onClick={handleCustomize}
        disabled={customizing}
        className="w-full"
      >
        {customizing ? 'Customizing...' : 'Start AI Customization'}
      </Button>
    </div>
  );
}