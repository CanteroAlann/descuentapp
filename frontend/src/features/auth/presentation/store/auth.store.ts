/**
 * @module features/auth/presentation/store
 * @description Store de autenticación con Zustand.
 * Gestiona el estado de sesión y sincroniza con almacenamiento seguro.
 */
import { create } from 'zustand';
import { SecureStorageAdapter } from '../../../../infrastructure/storage';

/**
 * Estado del store de autenticación
 */
interface AuthState {
  /** Token JWT del usuario autenticado */
  token: string | null;
  /** Indica si el usuario está autenticado */
  isAuthenticated: boolean;
  /** Indica si se está verificando la autenticación */
  isLoading: boolean;
}

/**
 * Acciones del store de autenticación
 */
interface AuthActions {
  /** Inicia sesión guardando el token en memoria y almacenamiento seguro */
  login: (token: string) => Promise<void>;
  /** Cierra sesión eliminando el token de memoria y almacenamiento seguro */
  logout: () => Promise<void>;
  /** Verifica si existe una sesión previa al iniciar la app */
  checkAuth: () => Promise<void>;
}

/**
 * Tipo completo del store de autenticación
 */
type AuthStore = AuthState & AuthActions;

/**
 * Estado inicial del store
 */
const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isLoading: true, // Inicia en true para verificar sesión existente
};

/**
 * Store de autenticación
 * Maneja el estado de sesión del usuario y persiste en almacenamiento seguro
 */
export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  /**
   * Inicia sesión con el token proporcionado
   * Guarda en memoria (Zustand) y en almacenamiento seguro (SecureStore)
   */
  login: async (token: string) => {
    try {
      // Guardar en almacenamiento seguro primero
      await SecureStorageAdapter.saveToken(token);
      
      // Actualizar estado en memoria
      set({
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      if (__DEV__) {
        console.log('✅ Sesión iniciada correctamente');
      }
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      // En caso de error, asegurar estado limpio
      set({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Cierra la sesión del usuario
   * Elimina el token de memoria y del almacenamiento seguro
   */
  logout: async () => {
    try {
      // Eliminar del almacenamiento seguro
      await SecureStorageAdapter.removeToken();
      
      // Limpiar estado en memoria
      set({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      if (__DEV__) {
        console.log('✅ Sesión cerrada correctamente');
      }
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      // Aún así, limpiar el estado local
      set({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Verifica si existe una sesión previa
   * Llamar al iniciar la app para hidratar el store
   */
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Intentar recuperar token del almacenamiento seguro
      const token = await SecureStorageAdapter.getToken();
      
      if (token) {
        // Token encontrado, hidratar el store
        set({
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        if (__DEV__) {
          console.log('✅ Sesión restaurada desde almacenamiento seguro');
        }
      } else {
        // No hay token, usuario no autenticado
        set({
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        if (__DEV__) {
          console.log('ℹ️ No se encontró sesión previa');
        }
      }
    } catch (error) {
      console.error('❌ Error al verificar autenticación:', error);
      set({
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

/**
 * Selector para obtener solo el estado de autenticación
 * Útil para evitar re-renders innecesarios
 */
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;

/**
 * Selector para obtener el estado de carga
 */
export const selectIsLoading = (state: AuthStore) => state.isLoading;

/**
 * Selector para obtener el token
 */
export const selectToken = (state: AuthStore) => state.token;
