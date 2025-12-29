
import type { User } from '../entities/User';
import type { Email } from '../value-objects/Email';
import type { CreateUserDTO } from '@application/dtos/UserDTO';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: CreateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
}
