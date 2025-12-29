import type { Email } from '@domain/value-objects/Email';

export type User = Readonly<{
  id: string;
  email: Email;
  fullName: string;
  createdAt: Date;
}>;

export type CreateUserParams = Readonly<{
  id: string;
  email: Email;
  fullName: string;
  createdAt: Date;
}>;

export const createUser = (params: CreateUserParams): User => ({
  id: params.id,
  email: params.email,
  fullName: params.fullName,
  createdAt: params.createdAt,
});
