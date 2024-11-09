'use client';

import { ProductTemplate } from '@/modules/product/core/types/product';
import { useProductTypeStore } from '@/modules/product/infrastructure/store/useProductTypeStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle, MinusCircle } from 'lucide-react';

interface BatchImportPreviewProps {
  templates: ProductTemplate[];
  existingTemplates: ProductTemplate[];
  skipMetaValidation?: boolean;
}

export function BatchImportPreview({ 
  templates, 
  existingTemplates, 
  skipMetaValidation = false 
}: BatchImportPreviewProps) {
  const { types } = useProductTypeStore();

  const getDuplicateStatus = (template: ProductTemplate) => {
    return existingTemplates.some(
      (existing) => existing.handle === template.handle
    );
  };

  const getValidationStatus = (template: ProductTemplate) => {
    const issues: string[] = [];

    if (!template.title?.trim()) issues.push('Missing title');
    if (!template.handle?.trim()) issues.push('Missing handle');
    if (!template.vendor?.trim()) issues.push('Missing vendor');
    if (!template.product_type_id?.trim()) issues.push('Missing product type ID');
    if (!Array.isArray(template.images) || template.images.length === 0) {
      issues.push('No images');
    }
    if (!Array.isArray(template.variants) || template.variants.length === 0) {
      issues.push('No variants');
    }

    return issues;
  };

  const hasMetaVariations = (template: ProductTemplate) => {
    return template.meta_variations && 
           template.meta_variations.product_main_description?.length > 0;
  };

  const getProductTypeName = (typeId: string) => {
    const type = types.find(t => t.id === typeId);
    return type ? type.name : 'Unknown Type';
  };

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Handle</TableHead>
            <TableHead>Product Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Validation</TableHead>
            <TableHead>Meta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template, index) => {
            const isDuplicate = getDuplicateStatus(template);
            const validationIssues = getValidationStatus(template);
            const hasMeta = hasMetaVariations(template);
            
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{template.title}</TableCell>
                <TableCell>{template.handle}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getProductTypeName(template.product_type_id)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {isDuplicate ? (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Will Update
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      New
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {validationIssues.length === 0 ? (
                    <div className="flex items-center text-green-600">
                      <Check className="w-4 h-4 mr-1" />
                      Valid
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <X className="w-4 h-4 mr-1" />
                      {validationIssues.join(', ')}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {skipMetaValidation ? (
                    <div className="flex items-center text-muted-foreground">
                      <MinusCircle className="w-4 h-4 mr-1" />
                      Skipped
                    </div>
                  ) : hasMeta ? (
                    <div className="flex items-center text-green-600">
                      <Check className="w-4 h-4 mr-1" />
                      Present
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Missing
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}