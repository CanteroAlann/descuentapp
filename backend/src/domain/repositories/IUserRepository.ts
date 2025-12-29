import type { Email } from '../value-objects/Email';
import type { CreateUserDTO } from '@application/dtos/UserDTO';
import type { UserResponseDTO } from '@application/dtos/UserDTO';

export interface IUserRepository {
  findById(id: string): Promise<UserResponseDTO | null>;
  findByEmail(email: Email): Promise<UserResponseDTO| null>;
  save(user: CreateUserDTO): Promise<UserResponseDTO>;
  delete(id: string): Promise<void>;
}
