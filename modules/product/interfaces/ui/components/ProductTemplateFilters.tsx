'use client';

import { useState } from 'react';
import { useProductTypeStore } from '@/modules/product/infrastructure/store/useProductTypeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductTypeDialog } from './ProductTypeDialog';
import { Plus, Settings2 } from 'lucide-react';

interface ProductTemplateFiltersProps {
  onFilterChange: (filters: {
    search: string;
    type: string;
    sortBy: string;
  }) => void;
}

export function ProductTemplateFilters({ onFilterChange }: ProductTemplateFiltersProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const { types } = useProductTypeStore();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, type: selectedType, sortBy });
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    onFilterChange({ search, type: value, sortBy });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange({ search, type: selectedType, sortBy: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowTypeDialog(true)}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <ProductTypeDialog
        open={showTypeDialog}
        onOpenChange={setShowTypeDialog}
      />
    </div>
  );
}