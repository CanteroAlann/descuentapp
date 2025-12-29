import type { User } from '@domain/entities/User'; 
import type { UserResponseDTO } from '@application/dtos/UserDTO';


export interface IUserRepository {
  findById(id: string): Promise<UserResponseDTO | null>;
  findByEmail(email: string): Promise<User| null>;
  save(user: User): Promise<UserResponseDTO>;
  delete(id: string): Promise<void>;
}
