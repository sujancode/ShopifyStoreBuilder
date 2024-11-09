import { AuthRepository } from '../../core/repositories/AuthRepository';
import { RegisterCredentials } from '../../core/types/auth';
import { AuthUser } from '../../core/entities/AuthUser';

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(credentials: RegisterCredentials): Promise<AuthUser> {
    const { email, password, confirmPassword } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }

    return this.authRepository.register(email, password);
  }
}