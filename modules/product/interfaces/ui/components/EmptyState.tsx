import { FileText } from 'lucide-react';
import { CreateTemplateButton } from './CreateTemplateButton';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
      <div className="p-3 bg-primary/10 rounded-full">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No templates yet</h3>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
        Create your first product template to start generating product variations with AI.
      </p>
      <div className="mt-6">
        <CreateTemplateButton />
      </div>
    </div>
  );
}