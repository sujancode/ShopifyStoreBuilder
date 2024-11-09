'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProductStore } from '@/modules/product/infrastructure/store/useProductStore';
import { Import, Download, Loader2 } from 'lucide-react';
import { BatchImportDialog } from './BatchImportDialog';

export function ImportExportButtons() {
  const [isExporting, setIsExporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { templates } = useProductStore();
  const { toast } = useToast();

  const handleExport = async () => {
    if (templates.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No templates to export',
      });
      return;
    }

    setIsExporting(true);
    try {
      const data = JSON.stringify(templates, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'product-templates.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Templates exported successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to export templates',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setShowImportDialog(true)}
        >
          <Import className="w-4 h-4 mr-2" />
          Import
        </Button>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting || templates.length === 0}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export
        </Button>
      </div>

      <BatchImportDialog 
        open={showImportDialog} 
        onOpenChange={setShowImportDialog} 
      />
    </>
  );
}