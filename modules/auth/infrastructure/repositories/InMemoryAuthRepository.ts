import { AuthRepository } from '../../core/repositories/AuthRepository';
import { AuthUser } from '../../core/entities/AuthUser';

export class InMemoryAuthRepository implements AuthRepository {
  private users: Map<string, { user: AuthUser; password: string }> = new Map();
  private currentUser: AuthUser | null = null;

  async register(email: string, password: string): Promise<AuthUser> {
    if (Array.from(this.users.values()).some(entry => entry.user.email === email)) {
      throw new Error('Email already registered');
    }

    const id = crypto.randomUUID();
    const user = new AuthUser(id, email);
    this.users.set(id, { user, password });
    this.currentUser = user;
    
    return user;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const userEntry = Array.from(this.users.values()).find(
      entry => entry.user.email === email && entry.password === password
    );

    if (!userEntry) {
      throw new Error('Invalid credentials');
    }

    this.currentUser = userEntry.user;
    return userEntry.user;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.currentUser;
  }

  async updateUserProfile(userId: string, data: Partial<AuthUser>): Promise<void> {
    const userEntry = this.users.get(userId);
    if (!userEntry) {
      throw new Error('User not found');
    }

    const updatedUser = new AuthUser(
      userId,
      data.email || userEntry.user.email
    );

    this.users.set(userId, { ...userEntry, user: updatedUser });
    if (this.currentUser?.id === userId) {
      this.currentUser = updatedUser;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    if (!this.users.has(userId)) {
      throw new Error('User not found');
    }

    this.users.delete(userId);
    if (this.currentUser?.id === userId) {
      this.currentUser = null;
    }
  }
}