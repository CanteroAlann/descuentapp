import { IUserRepository } from '@domain/repositories/IUserRepository';
import type { User } from '@domain/entities/User';
import  { CreateUserDTO } from '@application/dtos/UserDTO';
import { err, ok, Result } from '@domain/shared/Result';
import { HashService } from '@domain/services/hash.service';



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
): Promise<Result<User, CreateUserError>> => {
  try {
    const { repo, hasher} = deps;
    const passwordHashed = await hasher.hash(userData.password);
    userData.password = passwordHashed;
    const newUser = await repo.save(userData);
    return ok(newUser);
  } catch (error) {
    return err({ type: 'UserCreationFailed', reason: (error as Error).message });
  }
}