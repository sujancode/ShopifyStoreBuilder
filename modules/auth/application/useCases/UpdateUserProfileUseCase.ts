import { AuthRepository } from '../../core/repositories/AuthRepository';
import { AuthUser } from '../../core/entities/AuthUser';

export class UpdateUserProfileUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(userId: string, data: Partial<AuthUser>): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (data.email && !data.email.includes('@')) {
      throw new Error('Invalid email format');
    }

    return this.authRepository.updateUserProfile(userId, data);
  }
}