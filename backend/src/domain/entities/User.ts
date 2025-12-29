import type { Email } from '@domain/value-objects/Email';

export type User = Readonly<{
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
  password: string;
}>;

export type CreateUserParams = Readonly<{
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
  password: string;
}>;

export const createUser = (params: CreateUserParams): User => ({
  id: params.id,
  email: params.email,
  fullName: params.fullName,
  createdAt: params.createdAt,
  password: params.password,
});
