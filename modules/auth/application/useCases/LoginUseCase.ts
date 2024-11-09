import { AuthRepository } from '../../core/repositories/AuthRepository';
import { LoginCredentials } from '../../core/types/auth';
import { AuthUser } from '../../core/entities/AuthUser';

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthUser> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    return this.authRepository.login(email, password);
  }
}