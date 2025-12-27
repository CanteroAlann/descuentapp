
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly createdAt: Date
  ) {}

  // Domain logic methods here
}
