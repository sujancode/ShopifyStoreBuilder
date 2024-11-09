export interface StoreConfig {
  storeName: string;
  storeUrl: string;
  businessType: string;
  industry: string;
  banners: string[];
  location: {
    country: string;
    currency: string;
    timezone: string;
  };
}

export class Store {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public config: StoreConfig,
    public status: 'draft' | 'creating' | 'active' | 'error',
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(userId: string, config: StoreConfig): Store {
    return new Store(
      crypto.randomUUID(),
      userId,
      {
        ...config,
        banners: config.banners || []
      },
      'draft',
      new Date(),
      new Date()
    );
  }
}