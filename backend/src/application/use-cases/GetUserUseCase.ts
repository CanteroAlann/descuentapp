
import { IUserRepository } from '@domain/repositories/IUserRepository';
import type { User } from '@domain/entities/User';
import { err, ok, Result } from '@domain/shared/Result';

export type GetUserError = {
  readonly type: 'UserNotFound';
  readonly userId: string;
};

export const getUser = async (
  userId: string,
  userRepository: IUserRepository
): Promise<Result<User, GetUserError>> => {
  const user = await userRepository.findById(userId);

  if (!user) {
    return err({ type: 'UserNotFound', userId });
  }

  return ok(user);
};
