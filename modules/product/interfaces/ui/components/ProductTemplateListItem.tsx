'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductTemplate } from '@/modules/product/core/types/product';
import { useProductStore } from '@/modules/product/infrastructure/store/useProductStore';
import { useProductTypeStore } from '@/modules/product/infrastructure/store/useProductTypeStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { MoreVertical, Pencil, Trash, Eye, Copy, Tag } from 'lucide-react';
import { DeleteTemplateDialog } from './DeleteTemplateDialog';

interface ProductTemplateListItemProps {
  template: ProductTemplate;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}

export function ProductTemplateListItem({ 
  template, 
  isSelected, 
  onSelect 
}: ProductTemplateListItemProps) {
  const { deleteTemplate } = useProductStore();
  const { types } = useProductTypeStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const productTypeName = types.find(t => t.id === template.product_type_id)?.name || 'Unknown Type';

  const handleDuplicate = async () => {
    try {
      const duplicatedTemplate = {
        ...template,
        title: `${template.title} (Copy)`,
        handle: `${template.handle}-copy`
      };
      await useProductStore.getState().createTemplate(duplicatedTemplate);
      toast({
        title: 'Success',
        description: 'Template duplicated successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };

  const handleDelete = async () => {
    if (!template.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Template ID is missing',
      });
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTemplate(template.id);
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className={isSelected ? 'ring-2 ring-primary' : ''}>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="mt-1"
            />

            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {template.images[0] && (
                <img
                  src={template.images[0]}
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-grow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{template.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">
                      <Tag className="w-3 h-3 mr-1" />
                      {productTypeName}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {template.variants.length} variants
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {template.meta_variations.product_main_description[0]}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${template.handle}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${template.handle}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDuplicate}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/products/${template.handle}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/products/${template.handle}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicate}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteTemplateDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}