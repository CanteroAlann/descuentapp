import { IUserRepository } from '@domain/repositories/IUserRepository';

import  { CreateUserDTO, UserResponseDTO} from '@application/dtos/UserDTO';
import { err, ok, Result } from '@domain/shared/Result';
import { HashService } from '@domain/services/hash.service';
import { logger } from '@infrastructure/logger/logger';



export type Dependencies = {
  repo: IUserRepository;
  hasher: HashService;
};

export type CreateUserError = {
  readonly type: 'UserCreationFailed';
  readonly reason: string;
};

export const createUser = async (
  userData: CreateUserDTO,
  deps: Dependencies
): Promise<Result<UserResponseDTO, CreateUserError>> => {
  try {
    const { repo, hasher} = deps;
    const passwordHashed = await hasher.hash(userData.password);
    logger.debug('Password hashed', { passwordHashed });
    userData.password = passwordHashed;
    const newUser : UserResponseDTO = await repo.save(userData);
    logger.debug('User created successfully', newUser);

    return ok(newUser);
  } catch (error) {
    return err({ type: 'UserCreationFailed', reason: (error as Error).message });
  }
}