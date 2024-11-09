import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductTemplate, GeneratedProduct } from '../../core/types/product';
import { ProductTemplateRepository } from '../../core/repositories/ProductTemplateRepository';

export class FirebaseProductTemplateRepository implements ProductTemplateRepository {
  private readonly templatesCollection = 'productTemplates';
  private readonly productsCollection = 'generatedProducts';

  async createTemplate(template: ProductTemplate): Promise<ProductTemplate> {
    const templateRef = doc(collection(db, this.templatesCollection));
    await setDoc(templateRef, {
      ...template,
      id: templateRef.id,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return {
      ...template,
      id: templateRef.id,
    };
  }

  async getTemplate(id: string): Promise<ProductTemplate> {
    const templateRef = doc(db, this.templatesCollection, id);
    const templateDoc = await getDoc(templateRef);
    
    if (!templateDoc.exists()) {
      throw new Error('Template not found');
    }
    
    return {
      ...templateDoc.data(),
      id: templateDoc.id,
    } as ProductTemplate;
  }

  async updateTemplate(handle: string, template: Partial<ProductTemplate>): Promise<ProductTemplate> {
    const templatesRef = collection(db, this.templatesCollection);
    const q = query(templatesRef, where('handle', '==', handle));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Template not found');
    }

    const templateDoc = querySnapshot.docs[0];
    const currentTemplate = templateDoc.data() as ProductTemplate;

    const updatedTemplate = {
      ...currentTemplate,
      ...template,
      handle,
      updated_at: serverTimestamp(),
    };

    await setDoc(templateDoc.ref, updatedTemplate);
    return {
      ...updatedTemplate,
      id: templateDoc.id,
    } as ProductTemplate;
  }

  async deleteTemplate(id: string): Promise<void> {
    // First, delete all generated products for this template
    const productsRef = collection(db, this.productsCollection);
    const q = query(productsRef, where('template_id', '==', id));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Then delete the template
    const templateRef = doc(db, this.templatesCollection, id);
    await deleteDoc(templateRef);
  }

  async listTemplates(): Promise<ProductTemplate[]> {
    const templatesRef = collection(db, this.templatesCollection);
    const querySnapshot = await getDocs(templatesRef);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as ProductTemplate));
  }

  async generateProduct(templateId: string): Promise<GeneratedProduct> {
    const template = await this.getTemplate(templateId);
    
    // Select random variations from meta data
    const mainDescription = this.getRandomElement(template.meta_variations.product_main_description);
    const imageTextSections = template.meta_variations.image_with_text_sections.map(section => ({
      title: this.getRandomElement(section.title_variations),
      description: this.getRandomElement(section.description_variations),
    }));
    const qaSections = template.meta_variations.collapsible_qa_sections.map(section => ({
      question: section.question,
      answer: this.getRandomElement(section.answer_variations),
    }));
    const selectedTitle = this.getRandomElement(template.meta_variations.brandable_title_variations);

    const generatedProduct: GeneratedProduct = {
      id: crypto.randomUUID(),
      template_id: templateId,
      title: selectedTitle,
      handle: template.handle,
      images: template.images,
      variants: template.variants,
      body_html: template.body_html,
      vendor: template.vendor,
      product_type: template.product_type,
      product_type_id: template.product_type_id,
      tags: template.tags ? template.tags.split(',').map(tag => tag.trim()) : [],
      selected_meta: {
        main_description: mainDescription,
        image_text_sections: imageTextSections,
        qa_sections: qaSections,
        selected_title: selectedTitle,
      },
      created_at: new Date(),
      updated_at: new Date(),
    };

    const productRef = doc(collection(db, this.productsCollection));
    await setDoc(productRef, {
      ...generatedProduct,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return generatedProduct;
  }

  async getGeneratedProduct(id: string): Promise<GeneratedProduct> {
    const productRef = doc(db, this.productsCollection, id);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      throw new Error('Generated product not found');
    }
    
    return productDoc.data() as GeneratedProduct;
  }

  async listGeneratedProducts(templateId: string): Promise<GeneratedProduct[]> {
    const productsRef = collection(db, this.productsCollection);
    const q = query(productsRef, where('template_id', '==', templateId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as GeneratedProduct);
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}