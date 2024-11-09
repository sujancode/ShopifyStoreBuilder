'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';
import { ProductMetaVariations } from '@/modules/product/core/types/product';

interface MetaVariationsFormProps {
  value: ProductMetaVariations;
  onChange: (value: ProductMetaVariations) => void;
}

export function MetaVariationsForm({ value, onChange }: MetaVariationsFormProps) {
  const addMainDescription = () => {
    onChange({
      ...value,
      product_main_description: [...value.product_main_description, ''],
    });
  };

  const updateMainDescription = (index: number, text: string) => {
    const newDescriptions = [...value.product_main_description];
    newDescriptions[index] = text;
    onChange({
      ...value,
      product_main_description: newDescriptions,
    });
  };

  const removeMainDescription = (index: number) => {
    onChange({
      ...value,
      product_main_description: value.product_main_description.filter((_, i) => i !== index),
    });
  };

  const addImageTextSection = () => {
    onChange({
      ...value,
      image_with_text_sections: [
        ...value.image_with_text_sections,
        { title_variations: [''], description_variations: [''] },
      ],
    });
  };

  const updateImageTextSection = (
    index: number,
    field: 'title_variations' | 'description_variations',
    subIndex: number,
    text: string
  ) => {
    const newSections = [...value.image_with_text_sections];
    newSections[index][field][subIndex] = text;
    onChange({
      ...value,
      image_with_text_sections: newSections,
    });
  };

  const addImageTextVariation = (
    sectionIndex: number,
    field: 'title_variations' | 'description_variations'
  ) => {
    const newSections = [...value.image_with_text_sections];
    newSections[sectionIndex][field].push('');
    onChange({
      ...value,
      image_with_text_sections: newSections,
    });
  };

  const removeImageTextVariation = (
    sectionIndex: number,
    field: 'title_variations' | 'description_variations',
    varIndex: number
  ) => {
    const newSections = [...value.image_with_text_sections];
    newSections[sectionIndex][field] = newSections[sectionIndex][field].filter(
      (_, i) => i !== varIndex
    );
    onChange({
      ...value,
      image_with_text_sections: newSections,
    });
  };

  const addQASection = () => {
    onChange({
      ...value,
      collapsible_qa_sections: [
        ...value.collapsible_qa_sections,
        { question: '', answer_variations: [''] },
      ],
    });
  };

  const updateQASection = (
    index: number,
    field: 'question' | 'answer_variations',
    subIndex?: number,
    text?: string
  ) => {
    const newSections = [...value.collapsible_qa_sections];
    if (field === 'question') {
      newSections[index].question = text!;
    } else if (subIndex !== undefined && text !== undefined) {
      newSections[index].answer_variations[subIndex] = text;
    }
    onChange({
      ...value,
      collapsible_qa_sections: newSections,
    });
  };

  const addAnswerVariation = (sectionIndex: number) => {
    const newSections = [...value.collapsible_qa_sections];
    newSections[sectionIndex].answer_variations.push('');
    onChange({
      ...value,
      collapsible_qa_sections: newSections,
    });
  };

  const removeAnswerVariation = (sectionIndex: number, varIndex: number) => {
    const newSections = [...value.collapsible_qa_sections];
    newSections[sectionIndex].answer_variations = newSections[
      sectionIndex
    ].answer_variations.filter((_, i) => i !== varIndex);
    onChange({
      ...value,
      collapsible_qa_sections: newSections,
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Main Product Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {value.product_main_description.map((desc, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={desc}
                onChange={(e) => updateMainDescription(index, e.target.value)}
                placeholder="Enter product description variation"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMainDescription(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addMainDescription}>
            <Plus className="h-4 w-4 mr-2" />
            Add Description Variation
          </Button>
        </CardContent>
      </Card>

      {/* Image with Text Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Image with Text Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {value.image_with_text_sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4 border-b pb-6">
              <div className="space-y-4">
                <Label>Title Variations</Label>
                {section.title_variations.map((title, varIndex) => (
                  <div key={varIndex} className="flex gap-2">
                    <Input
                      value={title}
                      onChange={(e) =>
                        updateImageTextSection(
                          sectionIndex,
                          'title_variations',
                          varIndex,
                          e.target.value
                        )
                      }
                      placeholder="Enter title variation"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeImageTextVariation(
                          sectionIndex,
                          'title_variations',
                          varIndex
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    addImageTextVariation(sectionIndex, 'title_variations')
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Title Variation
                </Button>
              </div>

              <div className="space-y-4">
                <Label>Description Variations</Label>
                {section.description_variations.map((desc, varIndex) => (
                  <div key={varIndex} className="flex gap-2">
                    <Textarea
                      value={desc}
                      onChange={(e) =>
                        updateImageTextSection(
                          sectionIndex,
                          'description_variations',
                          varIndex,
                          e.target.value
                        )
                      }
                      placeholder="Enter description variation"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeImageTextVariation(
                          sectionIndex,
                          'description_variations',
                          varIndex
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    addImageTextVariation(sectionIndex, 'description_variations')
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Description Variation
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addImageTextSection}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image with Text Section
          </Button>
        </CardContent>
      </Card>

      {/* Q&A Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Q&A Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {value.collapsible_qa_sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4 border-b pb-6">
              <div>
                <Label>Question</Label>
                <Input
                  value={section.question}
                  onChange={(e) =>
                    updateQASection(sectionIndex, 'question', undefined, e.target.value)
                  }
                  placeholder="Enter question"
                />
              </div>

              <div className="space-y-4">
                <Label>Answer Variations</Label>
                {section.answer_variations.map((answer, varIndex) => (
                  <div key={varIndex} className="flex gap-2">
                    <Textarea
                      value={answer}
                      onChange={(e) =>
                        updateQASection(
                          sectionIndex,
                          'answer_variations',
                          varIndex,
                          e.target.value
                        )
                      }
                      placeholder="Enter answer variation"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAnswerVariation(sectionIndex, varIndex)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => addAnswerVariation(sectionIndex)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Answer Variation
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addQASection}>
            <Plus className="h-4 w-4 mr-2" />
            Add Q&A Section
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}