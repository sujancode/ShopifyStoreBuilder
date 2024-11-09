'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Eye, Code, Save, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface HtmlPreviewEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
}

export function HtmlPreviewEditor({ initialContent, onChange }: HtmlPreviewEditorProps) {
  const [htmlContent, setHtmlContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onChange(htmlContent);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setHtmlContent(initialContent);
    setIsEditing(false);
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>HTML Template</CardTitle>
        <CardDescription>
          Preview and edit the product HTML template
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="preview">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="edit">
                <Code className="w-4 h-4 mr-2" />
                Edit HTML
              </TabsTrigger>
            </TabsList>

            {isEditing && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="preview" className="mt-0">
            <div
              className="prose max-w-none p-4 rounded-lg border bg-white min-h-[400px]"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </TabsContent>

          <TabsContent value="edit" className="mt-0">
            <Textarea
              value={htmlContent}
              onChange={(e) => {
                setHtmlContent(e.target.value);
                setIsEditing(true);
              }}
              className="min-h-[400px] font-mono"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}