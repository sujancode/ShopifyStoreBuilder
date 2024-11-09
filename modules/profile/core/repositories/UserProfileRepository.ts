import { UserProfile } from '../entities/UserProfile';

export interface UserProfileRepository {
  createProfile(profile: UserProfile): Promise<UserProfile>;
  getProfileByUserId(userId: string): Promise<UserProfile | null>;
  updateProfile(id: string, data: Partial<UserProfile>): Promise<UserProfile>;
  deleteProfile(id: string): Promise<void>;
}