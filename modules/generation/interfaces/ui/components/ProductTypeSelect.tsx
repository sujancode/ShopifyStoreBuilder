import { useState } from 'react';
import { useGenerationStore } from '../../../infrastructure/store/useGenerationStore';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ProductTypeSelect({ value, onChange, disabled }: ProductTypeSelectProps) {
  const { productTypes } = useGenerationStore();

  // Group types by first letter
  const groupedTypes = productTypes.reduce((acc, type) => {
    const firstLetter = type.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(type);
    return acc;
  }, {} as Record<string, typeof productTypes>);

  // Sort groups alphabetically
  const sortedGroups = Object.entries(groupedTypes).sort(([a], [b]) => a.localeCompare(b));

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select product type">
          {value ? productTypes.find(t => t.id === value)?.name : 'Select product type'}
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
      </SelectContent>
    </Select>
  );
}