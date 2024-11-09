'use client';

import { useState, useRef, useEffect } from 'react';
import { useProductStore } from '@/modules/product/infrastructure/store/useProductStore';
import { useProductTypeStore } from '@/modules/product/infrastructure/store/useProductTypeStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductTemplate } from '@/modules/product/core/types/product';
import { BatchImportPreview } from './BatchImportPreview';
import { createEmptyMetaVariations } from '../utils/templateHelpers';
import { ProductTypeSelect } from './ProductTypeSelect';

interface BatchImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BatchImportDialog({
  open,
  onOpenChange,
}: BatchImportDialogProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMetaFile, setSelectedMetaFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedTemplates, setParsedTemplates] = useState<ProductTemplate[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [defaultProductTypeId, setDefaultProductTypeId] = useState('');
  const [showProductTypePrompt, setShowProductTypePrompt] = useState(false);
  const [skipMetaValidation, setSkipMetaValidation] = useState(false);
  const { importTemplates, templates: existingTemplates } = useProductStore();
  const { loadTypes } = useProductTypeStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const metaFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  // Update templates when default product type changes
  useEffect(() => {
    if (defaultProductTypeId && parsedTemplates.length > 0) {
      const updatedTemplates = parsedTemplates.map((template) => ({
        ...template,
        product_type: defaultProductTypeId,
        product_type_id: defaultProductTypeId,
      }));
      console.log(updatedTemplates);
      setParsedTemplates(updatedTemplates);
    }
  }, [defaultProductTypeId]);

  const resetState = () => {
    setSelectedFile(null);
    setSelectedMetaFile(null);
    setError(null);
    setParsedTemplates([]);
    setShowPreview(false);
    setDefaultProductTypeId('');
    setShowProductTypePrompt(false);
    setSkipMetaValidation(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (metaFileInputRef.current) {
      metaFileInputRef.current.value = '';
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        setError('Please select a JSON file');
        return;
      }

      try {
        const content = await file.text();
        let templates = JSON.parse(content);

        if (!Array.isArray(templates)) {
          throw new Error(
            'Invalid file format. Expected an array of templates.'
          );
        }

        // Add empty meta variations if skipping validation
        templates = templates.map((template) => ({
          ...template,
          meta_variations: skipMetaValidation
            ? createEmptyMetaVariations()
            : template.meta_variations,
        }));

        // Check if any template is missing product_type_id
        const hasMissingProductType = templates.some(
          (template) => !template.product_type_id?.trim()
        );
        setShowProductTypePrompt(hasMissingProductType);

        setParsedTemplates(templates);
        setSelectedFile(file);
        setShowPreview(true);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        setSelectedFile(null);
        setParsedTemplates([]);
        setShowPreview(false);
      }
    }
  };

  const handleMetaFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please select a JSON file for meta variations',
        });
        return;
      }
      setSelectedMetaFile(file);
      toast({
        title: 'Success',
        description: 'Meta variations file selected successfully',
      });
    }
  };

  const handleImport = async () => {
    if (!parsedTemplates.length) {
      setError('No valid templates to import');
      return;
    }

    if (showProductTypePrompt && !defaultProductTypeId.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a default product type',
      });
      return;
    }

    setIsImporting(true);
    try {
      let processedTemplates = parsedTemplates.map((template) => ({
        ...template,
        product_type_id:
          template.product_type_id?.trim() || defaultProductTypeId.trim(),
      }));

      // Process meta variations file if provided
      if (selectedMetaFile && skipMetaValidation) {
        const metaContent = await selectedMetaFile.text();
        const metaVariations = JSON.parse(metaContent);

        if (typeof metaVariations !== 'object') {
          throw new Error('Invalid meta variations format');
        }

        processedTemplates = processedTemplates.map((template) => ({
          ...template,
          meta_variations:
            metaVariations[template.handle] || createEmptyMetaVariations(),
        }));
      }

      // If skipping meta validation, validate without meta checks
      if (skipMetaValidation) {
        processedTemplates = processedTemplates.map((template) => ({
          ...template,
          meta_variations: createEmptyMetaVariations(),
        }));
      }

      await importTemplates(processedTemplates);

      toast({
        title: 'Success',
        description: `Successfully imported ${processedTemplates.length} templates`,
      });

      onOpenChange(false);
      resetState();
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to import templates',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    resetState();
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleChooseMetaFile = () => {
    metaFileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Product Templates</DialogTitle>
          <DialogDescription>
            Upload a JSON file containing product templates to import them in
            bulk.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-line">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="skipMeta"
              checked={skipMetaValidation}
              onCheckedChange={(checked) =>
                setSkipMetaValidation(checked as boolean)
              }
            />
            <Label htmlFor="skipMeta">
              Skip meta validation and import later
            </Label>
          </div>

          {!showPreview ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                {selectedFile
                  ? selectedFile.name
                  : 'Select a JSON file to import'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                type="button"
                onClick={handleChooseFile}
              >
                Choose File
              </Button>
            </div>
          ) : (
            <>
              {showProductTypePrompt && (
                <div className="space-y-2 mb-4">
                  <Label>
                    Some templates are missing product types. Select a default
                    product type:
                  </Label>
                  <ProductTypeSelect
                    value={defaultProductTypeId}
                    onChange={setDefaultProductTypeId}
                    disabled={isImporting}
                  />
                </div>
              )}

              {skipMetaValidation && (
                <div className="space-y-2 mb-4">
                  <Label>Meta Variations File (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={metaFileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleMetaFileSelect}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={handleChooseMetaFile}
                      className="w-full"
                    >
                      {selectedMetaFile
                        ? selectedMetaFile.name
                        : 'Choose Meta Variations File'}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can provide meta variations in a separate JSON file or
                    add them later
                  </p>
                </div>
              )}

              <BatchImportPreview
                templates={parsedTemplates}
                existingTemplates={existingTemplates}
                skipMetaValidation={skipMetaValidation}
              />
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {showPreview && (
            <Button
              onClick={handleImport}
              disabled={
                isImporting ||
                (showProductTypePrompt && !defaultProductTypeId.trim())
              }
            >
              {isImporting && <LoadingSpinner size="sm" className="mr-2" />}
              Import {parsedTemplates.length} Templates
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
