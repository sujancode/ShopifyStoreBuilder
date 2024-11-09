export interface ProductVariant {
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
}

export interface ImageWithTextSection {
  title_variations: string[];
  description_variations: string[];
}

export interface QASection {
  question: string;
  answer_variations: string[];
}

export interface ProductMetaVariations {
  product_main_description: string[];
  image_with_text_sections: ImageWithTextSection[];
  collapsible_qa_sections: QASection[];
  brandable_title_variations: string[];
}

export interface ProductType {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductTemplate {
  title: string;
  handle: string;
  images: string[];
  variants: ProductVariant[];
  body_html: string;
  vendor: string;
  product_type: string;
  product_type_id: string;
  tags: string;
  meta_variations: ProductMetaVariations;
  template_suffix: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface GeneratedProduct {
  id: string;
  template_id: string;
  title: string;
  handle: string;
  images: string[];
  variants: ProductVariant[];
  body_html: string;
  vendor: string;
  product_type: string;
  product_type_id: string;
  tags: string[];
  selected_meta: {
    main_description: string;
    image_text_sections: {
      title: string;
      description: string;
    }[];
    qa_sections: {
      question: string;
      answer: string;
    }[];
    selected_title: string;
  };
  created_at: Date;
  updated_at: Date;
}