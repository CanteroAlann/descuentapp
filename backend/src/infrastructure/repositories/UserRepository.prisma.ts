import {  prisma } from '@infrastructure/database/prisma';
import type { IUserRepository } from '@domain/repositories/IUserRepository';
import type { CreateUserDTO } from '@application/dtos/UserDTO';
import type { UserResponseDTO } from '@application/dtos/UserDTO';
import type { User } from '@domain/entities/User';
import { logger } from '@infrastructure/logger/logger';

export const UserRepositoryPrisma = (): IUserRepository => {
  return {
    async findById(id: string): Promise<UserResponseDTO | null> {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    },

    async findByEmail(email: string): Promise<User| null> {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      logger.debug('User fetched by email', { user });
      return user;
    }
    ,

    async save(user: CreateUserDTO): Promise<UserResponseDTO> {
      const newUser = await prisma.user.create({
        data: {
          fullName: user.fullName,
          email: user.email,
          password: user.password,
        },
      });
      return newUser;
    },

    async delete(id: string): Promise<void> {
      await prisma.user.delete({
        where: { id },
      });
    },
  };
}