
export interface CreateUserDTO {
  email: string;
  password: string;
  fullName: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  fullName: string;
}
