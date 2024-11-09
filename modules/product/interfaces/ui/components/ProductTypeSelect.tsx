import { useState } from 'react';
import { useProductTypeStore } from '@/modules/product/infrastructure/store/useProductTypeStore';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { ProductTypeDialog } from './ProductTypeDialog';

interface ProductTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ProductTypeSelect({ value, onChange, disabled }: ProductTypeSelectProps) {
  const { types } = useProductTypeStore();
  const [showDialog, setShowDialog] = useState(false);

  // Group types by first letter
  const groupedTypes = types.reduce((acc, type) => {
    const firstLetter = type.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(type);
    return acc;
  }, {} as Record<string, typeof types>);

  // Sort groups alphabetically
  const sortedGroups = Object.entries(groupedTypes).sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="Select product type">
            {value ? types.find(t => t.id === value)?.name : 'Select product type'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sortedGroups.map(([letter, groupTypes]) => (
            <SelectGroup key={letter}>
              <SelectLabel>{letter}</SelectLabel>
              {groupTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                  {type.description && (
                    <span className="text-muted-foreground ml-2 text-xs">
                      ({type.description})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
          <Separator className="my-2" />
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={(e) => {
              e.preventDefault();
              setShowDialog(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Type
          </Button>
        </SelectContent>
      </Select>

      <ProductTypeDialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open);
          // If dialog is closed and no type is selected, reset the value
          if (!open && !value) {
            onChange('');
          }
        }}
      />
    </>
  );
}