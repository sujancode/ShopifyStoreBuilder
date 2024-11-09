import { AuthRepository } from '../../core/repositories/AuthRepository';

export class DeleteUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return this.authRepository.deleteUser(userId);
  }
}