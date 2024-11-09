export interface GenerationSettings {
  productTypeId: string;
  templateId?: string;
}

export interface GenerationResult {
  id: string;
  settings: GenerationSettings;
  productId: string;
  createdAt: Date;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

export interface ProductTemplate {
  id: string;
  title: string;
  handle: string;
  images: string[];
  variants: Array<{
    price: string;
    position?: number;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    fulfillment_service: string;
    inventory_management: string;
    requires_shipping: boolean;
    sku: string;
    inventory_quantity: number;
  }>;
  body_html: string;
  vendor: string;
  product_type: string;
  product_type_id: string;
  tags: string;
  meta_variations: {
    product_main_description: string[];
    image_with_text_sections: Array<{
      title_variations: string[];
      description_variations: string[];
    }>;
    collapsible_qa_sections: Array<{
      question: string;
      answer_variations: string[];
    }>;
    brandable_title_variations: string[];
  };
}

export interface GeneratedProduct {
  id: string;
  title: string;
  handle: string;
  images: string[];
  variants: ProductTemplate['variants'];
  body_html: string;
  vendor: string;
  product_type: string;
  product_type_id: string;
  tags: string[];
  selected_meta: {
    main_description: string;
    image_text_sections: Array<{
      title: string;
      description: string;
    }>;
    qa_sections: Array<{
      question: string;
      answer: string;
    }>;
    selected_title: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductType {
  id: string;
  name: string;
  description?: string;
}