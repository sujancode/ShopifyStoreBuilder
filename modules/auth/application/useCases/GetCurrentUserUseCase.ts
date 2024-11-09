import { AuthRepository } from '../../core/repositories/AuthRepository';
import { AuthUser } from '../../core/entities/AuthUser';

export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<AuthUser | null> {
    return this.authRepository.getCurrentUser();
  }
}