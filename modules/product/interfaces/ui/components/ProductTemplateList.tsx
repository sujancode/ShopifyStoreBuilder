import { useState, useEffect } from 'react';
import { useProductStore } from '@/modules/product/infrastructure/store/useProductStore';
import { useProductTypeStore } from '@/modules/product/infrastructure/store/useProductTypeStore';
import { ProductTemplateCard } from './ProductTemplateCard';
import { ProductTemplateListItem } from './ProductTemplateListItem';
import { ProductTemplateFilters } from './ProductTemplateFilters';
import { BulkActions } from './BulkActions';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Grid, List } from 'lucide-react';
import { ProductTemplate } from '@/modules/product/core/types/product';

export function ProductTemplateList() {
  const { templates } = useProductStore();
  const { types, loadTypes } = useProductTypeStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filteredTemplates, setFilteredTemplates] = useState<ProductTemplate[]>(templates);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  const handleFilterChange = ({ search, type, sortBy }: { 
    search: string; 
    type: string; 
    sortBy: string; 
  }) => {
    let filtered = [...templates];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(searchLower) ||
        template.product_type.toLowerCase().includes(searchLower) ||
        template.vendor.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (type !== 'all') {
      filtered = filtered.filter(template => template.product_type_id === type);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFilteredTemplates(filtered);
    // Clear selection when filters change
    setSelectedIds([]);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredTemplates.map(t => t.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds(current => 
      checked 
        ? [...current, id]
        : current.filter(i => i !== id)
    );
  };

  const isAllSelected = 
    filteredTemplates.length > 0 && 
    selectedIds.length === filteredTemplates.length;

  const isIndeterminate = 
    selectedIds.length > 0 && 
    selectedIds.length < filteredTemplates.length;

  if (templates.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <ProductTemplateFilters onFilterChange={handleFilterChange} />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              indeterminate={isIndeterminate}
            />
            <span className="text-sm text-muted-foreground">
              Select all
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <BulkActions
          selectedIds={selectedIds}
          onClearSelection={() => setSelectedIds([])}
        />
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No templates found matching your filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <ProductTemplateCard 
              key={template.id} 
              template={template}
              isSelected={selectedIds.includes(template.id)}
              onSelect={(checked) => handleSelectOne(template.id, checked)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTemplates.map((template) => (
            <ProductTemplateListItem 
              key={template.id} 
              template={template}
              isSelected={selectedIds.includes(template.id)}
              onSelect={(checked) => handleSelectOne(template.id, checked)}
            />
          ))}
        </div>
      )}
    </div>
  );
}