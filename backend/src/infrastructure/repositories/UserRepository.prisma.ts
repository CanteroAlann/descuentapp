import {  prisma } from '@infrastructure/database/prisma';
import type { IUserRepository } from '@domain/repositories/IUserRepository';
import type { User } from '@domain/entities/User';
import type { CreateUserDTO } from '@application/dtos/UserDTO';
import { Email, emailToString } from '@domain/value-objects/Email';


export const UserRepositoryPrisma = (): IUserRepository => {
  return {
    async findById(id: string): Promise<User | null> {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    },

    async findByEmail(email: Email): Promise<User | null> {
        const emailToFind = emailToString(email);
      const user = await prisma.user.findUnique({
        where: { email: emailToFind },
      });
      return user;
    }
    ,

    async save(user: CreateUserDTO): Promise<User> {
      const newUser = await prisma.user.create({
        data: {
          fullName: user.fullName,
          email: user.email,
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