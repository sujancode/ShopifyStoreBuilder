import { collection, doc, getDoc, getDocs, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductType } from '@/modules/product/core/types/product';
import { GenerationSettings } from '../../core/types/generation';

export class FirebaseGenerationRepository {
  private readonly generatedProductsCollection = 'generatedProducts';
  private readonly productTypesCollection = 'productTypes';
  private readonly templatesCollection = 'productTemplates';

  async generateProduct(settings: GenerationSettings) {
    try {
      // Get product template
      const templatesRef = collection(db, this.templatesCollection);
      const templatesSnapshot = await getDocs(templatesRef);
      const templates = templatesSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(template => template.product_type_id === settings.productTypeId);

      if (templates.length === 0) {
        throw new Error('No templates found for the selected product type');
      }

      // Randomly select a template
      const template = templates[Math.floor(Math.random() * templates.length)];

      // Generate variations while maintaining product essence
      const mainDescription = this.getRandomElement(template.meta_variations.product_main_description);
      const selectedTitle = this.getRandomElement(template.meta_variations.brandable_title_variations);

      // Create consistent variations for image text sections
      const imageTextSections = template.meta_variations.image_with_text_sections.map(section => {
        // Keep titles and descriptions thematically consistent
        const titleIndex = Math.floor(Math.random() * section.title_variations.length);
        const descriptionIndex = titleIndex % section.description_variations.length;

        return {
          title: section.title_variations[titleIndex],
          description: section.description_variations[descriptionIndex],
        };
      });

      // Create consistent Q&A sections
      const qaSections = template.meta_variations.collapsible_qa_sections.map(section => {
        // Select answers that best match the question's context
        return {
          question: section.question,
          answer: this.getRandomElement(section.answer_variations),
        };
      });

      // Maintain variant relationships
      const variants = template.variants.map(variant => ({
        ...variant,
        // Ensure variant options are consistent with each other
        option1: variant.option1,
        option2: variant.option2 ? variant.option2 : null,
        option3: variant.option3 ? variant.option3 : null,
        price: variant.price,
        sku: `${variant.sku}-${Date.now()}`,
        inventory_quantity: variant.inventory_quantity,
      }));

      const generatedProduct = {
        id: crypto.randomUUID(),
        title: selectedTitle,
        handle: `${template.handle}-${Date.now()}`,
        images: template.images,
        variants,
        body_html: template.body_html,
        vendor: template.vendor,
        product_type: template.product_type,
        product_type_id: template.product_type_id,
        tags: template.tags.split(',').map(tag => tag.trim()),
        selected_meta: {
          main_description: mainDescription,
          image_text_sections: imageTextSections,
          qa_sections: qaSections,
          selected_title: selectedTitle,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to Firestore
      const productRef = doc(db, this.generatedProductsCollection, generatedProduct.id);
      await setDoc(productRef, {
        ...generatedProduct,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return generatedProduct;
    } catch (error) {
      console.error('Error generating product:', error);
      throw error;
    }
  }

  async listGeneratedProducts(productTypeId?: string) {
    try {
      const generatedProductsRef = collection(db, this.generatedProductsCollection);
      const querySnapshot = await getDocs(generatedProductsRef);
      let products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }));

      // Filter by product type if specified
      if (productTypeId) {
        products = products.filter(product => product.product_type_id === productTypeId);
      }

      // Sort by creation date (newest first)
      products.sort((a, b) => b.createdAt - a.createdAt);

      return products;
    } catch (error) {
      console.error('Error listing generated products:', error);
      throw error;
    }
  }

  async getGeneratedProduct(id: string) {
    try {
      const productRef = doc(db, this.generatedProductsCollection, id);
      const productDoc = await getDoc(productRef);
      
      if (!productDoc.exists()) {
        throw new Error('Generated product not found');
      }
      
      return {
        id: productDoc.id,
        ...productDoc.data(),
        createdAt: productDoc.data().createdAt?.toDate(),
        updatedAt: productDoc.data().updatedAt?.toDate(),
      };
    } catch (error) {
      console.error('Error getting generated product:', error);
      throw error;
    }
  }

  async deleteGeneratedProduct(id: string) {
    try {
      const productRef = doc(db, this.generatedProductsCollection, id);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting generated product:', error);
      throw error;
    }
  }

  async listProductTypes(): Promise<ProductType[]> {
    try {
      const typesRef = collection(db, this.productTypesCollection);
      const querySnapshot = await getDocs(typesRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as ProductType[];
    } catch (error) {
      console.error('Error listing product types:', error);
      throw error;
    }
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}