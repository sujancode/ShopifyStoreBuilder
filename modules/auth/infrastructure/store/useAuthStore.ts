import { create } from 'zustand';
import { AuthUser } from '../../core/entities/AuthUser';
import { FirebaseAuthRepository } from '../repositories/FirebaseAuthRepository';
import { AuthUseCaseFactory } from '../../application/factories/AuthUseCaseFactory';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  register: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userId: string, data: Partial<AuthUser>) => Promise<void>;
  deleteAccount: (userId: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  resetPassword: (code: string, newPassword: string) => Promise<void>;
}

const authRepository = new FirebaseAuthRepository();
const authUseCaseFactory = new AuthUseCaseFactory(authRepository);

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  register: async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    set({ loading: true, error: null });
    try {
      const registerUseCase = authUseCaseFactory.createRegisterUseCase();
      const user = await registerUseCase.execute({
        email,
        password,
        confirmPassword,
      });
      set({ user, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const loginUseCase = authUseCaseFactory.createLoginUseCase();
      const user = await loginUseCase.execute({ email, password });
      set({ user, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      const logoutUseCase = authUseCaseFactory.createLogoutUseCase();
      await logoutUseCase.execute();
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateProfile: async (userId: string, data: Partial<AuthUser>) => {
    set({ loading: true, error: null });
    try {
      const updateProfileUseCase =
        authUseCaseFactory.createUpdateUserProfileUseCase();
      await updateProfileUseCase.execute(userId, data);
      set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteAccount: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const deleteUserUseCase = authUseCaseFactory.createDeleteUserUseCase();
      await deleteUserUseCase.execute(userId);
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  sendVerificationEmail: async () => {
    set({ loading: true, error: null });
    try {
      await authRepository.sendEmailVerification();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  verifyEmail: async (code: string) => {
    set({ loading: true, error: null });
    try {
      await authRepository.verifyEmail(code);
      const currentUser = await authRepository.getCurrentUser();
      set({ user: currentUser, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  sendPasswordResetEmail: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await authRepository.sendPasswordResetEmail(email);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  resetPassword: async (code: string, newPassword: string) => {
    set({ loading: true, error: null });
    try {
      await authRepository.confirmPasswordReset(code, newPassword);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));
