import { collection, doc, getDoc, setDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Store, StoreConfig } from '../../core/entities/Store';
import { StoreRepository } from '../../core/repositories/StoreRepository';

export class FirebaseStoreRepository implements StoreRepository {
  private readonly collectionName = 'stores';

  async createStore(userId: string, config: StoreConfig): Promise<Store> {
    const store = Store.create(userId, config);
    const storeRef = doc(db, this.collectionName, store.id);
    await setDoc(storeRef, {
      ...store,
      createdAt: store.createdAt.toISOString(),
      updatedAt: store.updatedAt.toISOString(),
    });
    return store;
  }

  async getStoreByUserId(userId: string): Promise<Store | null> {
    const storesRef = collection(db, this.collectionName);
    const q = query(storesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const data = querySnapshot.docs[0].data();
    return new Store(
      data.id,
      data.userId,
      data.config,
      data.status,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }

  async updateStore(id: string, config: Partial<StoreConfig>): Promise<Store> {
    const storeRef = doc(db, this.collectionName, id);
    const storeDoc = await getDoc(storeRef);
    
    if (!storeDoc.exists()) {
      throw new Error('Store not found');
    }

    const currentStore = storeDoc.data();
    const updatedStore = {
      ...currentStore,
      config: { ...currentStore.config, ...config },
      updatedAt: new Date().toISOString(),
    };

    await setDoc(storeRef, updatedStore);
    return new Store(
      id,
      currentStore.userId,
      updatedStore.config,
      currentStore.status,
      new Date(currentStore.createdAt),
      new Date(updatedStore.updatedAt)
    );
  }

  async deleteStore(id: string): Promise<void> {
    const storeRef = doc(db, this.collectionName, id);
    await deleteDoc(storeRef);
  }
}