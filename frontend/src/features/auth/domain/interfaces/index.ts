/**
 * @module features/auth/domain/interfaces
 * @description Interfaces del dominio de autenticación
 */

/**
 * Credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Respuesta exitosa de autenticación
 */
export interface AuthResponse {
  success: boolean;
  token: string;
}

/**
 * Respuesta de error de autenticación
 */
export interface AuthErrorResponse {
  success: boolean;
  message: string;
}

/**
 * Usuario autenticado
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Contrato del repositorio de autenticación
 */
export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  // logout(): Promise<void>;
  // refreshToken(): Promise<AuthResponse>;
}
