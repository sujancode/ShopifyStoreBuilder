import { create } from 'zustand';
import { UserProfile, Location } from '../../core/entities/UserProfile';
import { FirebaseUserProfileRepository } from '../repositories/FirebaseUserProfileRepository';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  repository: FirebaseUserProfileRepository;
  createProfile: (
    userId: string,
    email: string,
    username: string,
    phoneNumber?: string,
    location?: Location
  ) => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  deleteProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  repository: new FirebaseUserProfileRepository(),

  createProfile: async (
    userId: string,
    email: string,
    username: string,
    phoneNumber?: string,
    location?: Location
  ) => {
    set({ loading: true, error: null });
    try {
      const profile = UserProfile.create(
        userId,
        email,
        username,
        phoneNumber,
        location
      );
      const createdProfile = await get().repository.createProfile(profile);
      set({ profile: createdProfile, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  loadProfile: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const profile = await get().repository.getProfileByUserId(userId);
      set({ profile, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const { profile } = get();
    if (!profile) throw new Error('No profile loaded');

    set({ loading: true, error: null });
    try {
      const updatedProfile = await get().repository.updateProfile(profile.id, data);
      set({ profile: updatedProfile, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteProfile: async () => {
    const { profile } = get();
    if (!profile) throw new Error('No profile loaded');

    set({ loading: true, error: null });
    try {
      await get().repository.deleteProfile(profile.id);
      set({ profile: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));