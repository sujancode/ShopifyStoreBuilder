import { ProductTemplate } from '@/modules/product/core/types/product';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateTemplate(template: ProductTemplate, skipMetaValidation = false): ValidationResult {
  const errors: string[] = [];

  // Required fields validation
  if (!template.title?.trim()) errors.push('Missing title');
  if (!template.handle?.trim()) errors.push('Missing handle');
  if (!template.vendor?.trim()) errors.push('Missing vendor');
  if (!template.product_type?.trim()) errors.push('Missing product type');

  // Images validation
  if (!Array.isArray(template.images)) {
    errors.push('Images must be an array');
  } else if (template.images.length === 0) {
    errors.push('At least one image is required');
  } else {
    template.images.forEach((url, index) => {
      if (typeof url !== 'string' || !url.trim()) {
        errors.push(`Invalid image URL at index ${index}`);
      }
    });
  }

  // Variants validation
  if (!Array.isArray(template.variants)) {
    errors.push('Variants must be an array');
  } else if (template.variants.length === 0) {
    errors.push('At least one variant is required');
  } else {
    template.variants.forEach((variant, index) => {
      if (!variant.price) errors.push(`Missing price for variant ${index}`);
      if (!variant.sku) errors.push(`Missing SKU for variant ${index}`);
    });
  }

  // Skip meta validation if specified
  if (!skipMetaValidation && !template.meta_variations) {
    errors.push('Missing meta variations');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}