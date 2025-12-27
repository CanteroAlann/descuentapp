
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { User } from '@domain/entities/User';

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
