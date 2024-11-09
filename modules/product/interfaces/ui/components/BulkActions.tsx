import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trash, ChevronDown } from 'lucide-react';
import { DeleteTemplateDialog } from './DeleteTemplateDialog';
import { useProductStore } from '@/modules/product/infrastructure/store/useProductStore';
import { useToast } from '@/hooks/use-toast';

interface BulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function BulkActions({ selectedIds, onClearSelection }: BulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteTemplate } = useProductStore();
  const { toast } = useToast();

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete templates sequentially to avoid overwhelming the database
      for (const id of selectedIds) {
        await deleteTemplate(id);
      }
      toast({
        title: 'Success',
        description: `Successfully deleted ${selectedIds.length} templates`,
      });
      onClearSelection();
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

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <span className="text-sm font-medium">
          {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onClearSelection()}>
                Clear Selection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeleteTemplateDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleBulkDelete}
        isDeleting={isDeleting}
        isBulk
      />
    </>
  );
}