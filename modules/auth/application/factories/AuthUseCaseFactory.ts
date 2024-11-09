import { AuthRepository } from '../../core/repositories/AuthRepository';
import { RegisterUseCase } from '../useCases/RegisterUseCase';
import { LoginUseCase } from '../useCases/LoginUseCase';
import { LogoutUseCase } from '../useCases/LogoutUseCase';
import { GetCurrentUserUseCase } from '../useCases/GetCurrentUserUseCase';
import { UpdateUserProfileUseCase } from '../useCases/UpdateUserProfileUseCase';
import { DeleteUserUseCase } from '../useCases/DeleteUserUseCase';

export class AuthUseCaseFactory {
  constructor(private authRepository: AuthRepository) {}

  createRegisterUseCase(): RegisterUseCase {
    return new RegisterUseCase(this.authRepository);
  }

  createLoginUseCase(): LoginUseCase {
    return new LoginUseCase(this.authRepository);
  }

  createLogoutUseCase(): LogoutUseCase {
    return new LogoutUseCase(this.authRepository);
  }

  createGetCurrentUserUseCase(): GetCurrentUserUseCase {
    return new GetCurrentUserUseCase(this.authRepository);
  }

  createUpdateUserProfileUseCase(): UpdateUserProfileUseCase {
    return new UpdateUserProfileUseCase(this.authRepository);
  }

  createDeleteUserUseCase(): DeleteUserUseCase {
    return new DeleteUserUseCase(this.authRepository);
  }
}