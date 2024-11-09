'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductTemplate } from '@/modules/product/core/types/product';
import { useProductStore } from '@/modules/product/infrastructure/store/useProductStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Pencil, 
  Tag, 
  Package, 
  Eye, 
  Code,
  Save,
  RefreshCw
} from 'lucide-react';

interface ProductTemplateDetailProps {
  template: ProductTemplate;
}

export function ProductTemplateDetail({ template }: ProductTemplateDetailProps) {
  const { updateTemplate } = useProductStore();
  const [htmlContent, setHtmlContent] = useState(template.body_html);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveHtml = async () => {
    setIsSaving(true);
    try {
      await updateTemplate(template.handle, {
        ...template,
        body_html: htmlContent
      });
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'HTML template updated successfully'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetHtml = () => {
    setHtmlContent(template.body_html);
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Template Info */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Template Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Product Type</h3>
              <Badge variant="secondary" className="mt-1">
                <Tag className="w-3 h-3 mr-1" />
                {template.product_type}
              </Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Vendor</h3>
              <p className="mt-1">{template.vendor}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Variants</h3>
              <p className="mt-1">
                <Package className="w-4 h-4 inline-block mr-1" />
                {template.variants.length} variants
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {template.tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href={`/products/${template.handle}/edit`}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Template
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Images Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              {template.images.length} images available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {template.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - HTML Preview & Editor */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>HTML Template</CardTitle>
            <CardDescription>
              Preview and edit the product HTML template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="preview">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="edit">
                    <Code className="w-4 h-4 mr-2" />
                    Edit HTML
                  </TabsTrigger>
                </TabsList>

                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetHtml}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveHtml}
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <TabsContent value="preview" className="mt-0">
                <div
                  className="prose max-w-none p-4 rounded-lg border bg-white"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </TabsContent>

              <TabsContent value="edit" className="mt-0">
                <Textarea
                  value={htmlContent}
                  onChange={(e) => {
                    setHtmlContent(e.target.value);
                    setIsEditing(true);
                  }}
                  className="min-h-[400px] font-mono"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}