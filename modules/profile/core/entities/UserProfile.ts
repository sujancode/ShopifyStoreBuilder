export interface Location {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export class UserProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public username: string,
    public email: string,
    public phoneNumber?: string,
    public location?: Location,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static create(
    userId: string,
    email: string,
    username: string,
    phoneNumber?: string,
    location?: Location
  ): UserProfile {
    return new UserProfile(
      crypto.randomUUID(),
      userId,
      username,
      email,
      phoneNumber,
      location,
      new Date(),
      new Date()
    );
  }

  update(data: Partial<UserProfile>): UserProfile {
    return new UserProfile(
      this.id,
      this.userId,
      data.username || this.username,
      data.email || this.email,
      data.phoneNumber || this.phoneNumber,
      data.location || this.location,
      this.createdAt,
      new Date()
    );
  }
}