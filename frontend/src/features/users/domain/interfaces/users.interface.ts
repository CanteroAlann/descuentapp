

export interface User{
    readonly id: string;
    readonly fullName: string;
    readonly email: string;
    readonly password?: string; // Optional para cuando se recibe del backend
}

export interface CreateUserInput {
    readonly fullName: string;
    readonly email: string;
    readonly password: string;
}

export interface IUserRepository {
    getByEmail(email: string): Promise<User | null>;
    getAll(): Promise<User[]>;
    create(user: CreateUserInput): Promise<User>;
}