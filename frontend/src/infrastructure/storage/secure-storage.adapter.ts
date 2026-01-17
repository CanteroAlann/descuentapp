/**
 * @module infrastructure/storage
 * @description Adaptador de almacenamiento seguro usando expo-secure-store.
 * Proporciona persistencia cifrada para datos sensibles como tokens.
 */
import * as SecureStore from 'expo-secure-store';

/**
 * Claves de almacenamiento seguro
 */
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
} as const;

/**
 * Adaptador de almacenamiento seguro
 * Encapsula la lógica de expo-secure-store para facilitar testing y mantenimiento
 */
export const SecureStorageAdapter = {
  /**
   * Guarda el token de autenticación de forma segura
   * @param token - Token JWT a almacenar
   * @throws Error si falla el almacenamiento
   */
  async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('❌ Error al guardar token en almacenamiento seguro:', error);
      throw new Error('No se pudo guardar el token de forma segura');
    }
  },

  /**
   * Obtiene el token de autenticación del almacenamiento seguro
   * @returns Token almacenado o null si no existe
   */
  async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      return token;
    } catch (error) {
      console.error('❌ Error al obtener token del almacenamiento seguro:', error);
      return null;
    }
  },

  /**
   * Elimina el token de autenticación del almacenamiento seguro
   * @throws Error si falla la eliminación
   */
  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('❌ Error al eliminar token del almacenamiento seguro:', error);
      throw new Error('No se pudo eliminar el token de forma segura');
    }
  },
};
