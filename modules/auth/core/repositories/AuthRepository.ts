import { AuthUser } from '../entities/AuthUser';

export interface AuthRepository {
  register(email: string, password: string): Promise<AuthUser>;
  login(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  updateUserProfile(userId: string, data: Partial<AuthUser>): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  sendEmailVerification(): Promise<void>;
  verifyEmail(code: string): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
  confirmPasswordReset(code: string, newPassword: string): Promise<void>;
}