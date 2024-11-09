import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductType } from '../../core/types/product';
import { ProductTypeRepository } from '../../core/repositories/ProductTypeRepository';

export class FirebaseProductTypeRepository implements ProductTypeRepository {
  private readonly collectionName = 'productTypes';

  async createType(type: Omit<ProductType, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductType> {
    const typeRef = doc(collection(db, this.collectionName));
    const now = new Date();
    const newType: ProductType = {
      id: typeRef.id,
      ...type,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(typeRef, {
      ...newType,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return newType;
  }

  async getType(id: string): Promise<ProductType> {
    const typeRef = doc(db, this.collectionName, id);
    const typeDoc = await getDoc(typeRef);
    
    if (!typeDoc.exists()) {
      throw new Error('Product type not found');
    }
    
    const data = typeDoc.data();
    return {
      ...data,
      id: typeDoc.id,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as ProductType;
  }

  async updateType(id: string, type: Partial<ProductType>): Promise<ProductType> {
    const typeRef = doc(db, this.collectionName, id);
    const typeDoc = await getDoc(typeRef);
    
    if (!typeDoc.exists()) {
      throw new Error('Product type not found');
    }

    const updatedType = {
      ...typeDoc.data(),
      ...type,
      updatedAt: serverTimestamp(),
    };

    await setDoc(typeRef, updatedType);
    return {
      ...updatedType,
      id,
      createdAt: updatedType.createdAt.toDate(),
      updatedAt: new Date(),
    } as ProductType;
  }

  async deleteType(id: string): Promise<void> {
    const typeRef = doc(db, this.collectionName, id);
    await deleteDoc(typeRef);
  }

  async listTypes(): Promise<ProductType[]> {
    const typesRef = collection(db, this.collectionName);
    const querySnapshot = await getDocs(typesRef);
    
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as ProductType[];
  }
}