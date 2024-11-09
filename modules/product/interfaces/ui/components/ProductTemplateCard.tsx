import { useState } from 'react';
import Link from 'next/link';
import { ProductTemplate } from '@/modules/product/core/types/product';
import { useProductStore } from '@/modules/product/infrastructure/store/useProductStore';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { MoreVertical, Pencil, Trash, Eye, Copy } from 'lucide-react';
import { DeleteTemplateDialog } from './DeleteTemplateDialog';

interface ProductTemplateCardProps {
  template: ProductTemplate;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}

export function ProductTemplateCard({ template, isSelected, onSelect }: ProductTemplateCardProps) {
  const { deleteTemplate } = useProductStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

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
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
            />
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

          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
            {template.images[0] && (
              <img
                src={template.images[0]}
                alt={template.title}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">{template.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {template.meta_variations.product_main_description[0]}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/products/${template.handle}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/products/${template.handle}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </CardFooter>
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