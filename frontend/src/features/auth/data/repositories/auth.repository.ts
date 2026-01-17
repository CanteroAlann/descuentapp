/**
 * @module features/auth/data/repositories
 * @description Implementación del repositorio de autenticación
 */
import { httpClient, ApiError } from '@/infrastructure/api';
import { API_ENDPOINTS } from '@/infrastructure/api/config';
import type { 
  IAuthRepository, 
  LoginCredentials, 
  AuthResponse 
} from '../../domain/interfaces';
import { authResponseSchema } from '../schemas';

/**
 * Repositorio de autenticación que conecta con el backend
 */
export class AuthRepository implements IAuthRepository {
  /**
   * Realiza el login del usuario
   * @param credentials - Credenciales de email y password
   * @returns Token de autenticación
   * @throws ApiError si las credenciales son inválidas o hay error de red
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Validar respuesta con Zod
    const validatedResponse = authResponseSchema.parse(response.data);
    
    return validatedResponse;
  }
}

/**
 * Instancia singleton del repositorio de autenticación
 */
export const authRepository = new AuthRepository();
