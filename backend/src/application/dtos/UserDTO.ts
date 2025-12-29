
export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  fullName: string;
}

export interface CreateUserDTO {
  email: string;
  fullName: string;
  password: string;
}
