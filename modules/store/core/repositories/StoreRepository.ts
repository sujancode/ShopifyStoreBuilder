import { Store, StoreConfig } from '../entities/Store';

export interface StoreRepository {
  createStore(userId: string, config: StoreConfig): Promise<Store>;
  getStoreByUserId(userId: string): Promise<Store | null>;
  updateStore(id: string, config: Partial<StoreConfig>): Promise<Store>;
  deleteStore(id: string): Promise<void>;
}