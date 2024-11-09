export interface UserLocation {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export class AuthUser {
  constructor(
    public readonly id: string,
    public email: string,
    private readonly roles: string[] = ['user'],
    private readonly createdAt: Date = new Date(),
    public readonly emailVerified: boolean = false,
    public username?: string,
    public location?: UserLocation,
    public updatedAt: Date = new Date()
  ) {}

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      roles: this.roles,
      createdAt: this.createdAt,
      emailVerified: this.emailVerified,
      username: this.username,
      location: this.location,
      updatedAt: this.updatedAt
    };
  }
}