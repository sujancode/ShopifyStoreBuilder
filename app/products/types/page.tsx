'use client';

import { useEffect, useState } from 'react';
import { useProductTypeStore } from '@/modules/product/infrastructure/store/useProductTypeStore';
import { ProductType } from '@/modules/product/core/types/product';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductTypeDialog } from '@/modules/product/interfaces/ui/components/ProductTypeDialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, Pencil, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductTypesPage() {
  const { types, loading, loadTypes, deleteType } = useProductTypeStore();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<ProductType | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  const handleEdit = (type: ProductType) => {
    setSelectedType(type);
    setShowDialog(true);
  };

  const handleDelete = async (type: ProductType) => {
    try {
      await deleteType(type.id);
      toast({
        title: 'Success',
        description: 'Product type deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    }
  };

  const handleAddNew = () => {
    setSelectedType(undefined);
    setShowDialog(true);
  };

  if (loading && types.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Types</CardTitle>
              <CardDescription>
                Manage product types for your templates
              </CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Type
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>
                    {new Date(type.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(type)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(type)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProductTypeDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        type={selectedType}
      />
    </div>
  );
}