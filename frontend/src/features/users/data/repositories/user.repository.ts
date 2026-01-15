/**
 * @module users/data/repositories
 * @description Implementación del repositorio de usuarios.
 * Conecta con la API, valida respuestas con Zod y mapea al dominio.
 */
import type { AxiosInstance } from 'axios';
import { 
  type User, 
  type CreateUserInput,
  type IUserRepository, 
} from '../../domain';
import { API_BASE_URL } from '@/infrastructure/api';

/**
 * Endpoints de la API de usuarios
 */
const ENDPOINTS = {
  BASE: `${API_BASE_URL}/users`,
  BY_EMAIL: (email: string) => `/users/${email}`,
} as const;

/**
 * Crea una instancia del repositorio de usuarios
 * @param httpClient - Cliente HTTP (Axios) configurado
 * @returns Implementación de IUserRepository
 */
export const createUserRepository = (
  httpClient: AxiosInstance
): IUserRepository => {
  return {
    /**
      * Crea un nuevo usuario
     */

    async create(userInput: CreateUserInput): Promise<User> {
      const response = await httpClient.post(ENDPOINTS.BASE, userInput);
      return response.data.data; // El backend devuelve { success: true, data: user }
    },

    async getByEmail(email: string): Promise<User | null> {
      try {
        const response = await httpClient.get(ENDPOINTS.BY_EMAIL(email));
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null; // Usuario no encontrado
        }
        throw error; // Re-lanzar otros errores
      }
    },

    async getAll(): Promise<User[]> {
      const response = await httpClient.get(ENDPOINTS.BASE);
      return response.data;
    }

  };
};
