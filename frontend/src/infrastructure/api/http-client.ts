/**
 * @module infrastructure/api
 * @description Cliente HTTP centralizado con Axios.
 * Configura interceptores, manejo de errores y logging.
 */
import axios, { 
  type AxiosInstance, 
  type AxiosError, 
  type InternalAxiosRequestConfig 
} from 'axios';
import { apiConfig, API_ERROR_CODES } from './config';
import { useAuthStore } from '../../features/auth/presentation/store';

/**
 * Error personalizado de la API
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public originalError?: AxiosError
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isUnauthorized(): boolean {
    return this.statusCode === API_ERROR_CODES.UNAUTHORIZED;
  }

  get isNotFound(): boolean {
    return this.statusCode === API_ERROR_CODES.NOT_FOUND;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

/**
 * Crea y configura la instancia de Axios
 */
const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeout,
    headers: apiConfig.headers,
  });

  // Request interceptor - agregar token de auth si existe
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Obtener token del store de auth (Zustand)
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log en desarrollo
      if (__DEV__) {
        console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - manejo centralizado de errores
  client.interceptors.response.use(
    (response) => {
      if (__DEV__) {
        console.log(`✅ ${response.status} ${response.config.url}`);
      }
      return response;
    },
    async (error: AxiosError<{ message?: string }>) => {
      if (__DEV__) {
        console.error(`❌ ${error.response?.status} ${error.config?.url}`, error.message);
      }

      // Transformar a ApiError
      const statusCode = error.response?.status || 0;
      const message = getErrorMessage(error);
      
      // Si es 401, limpiar sesión automáticamente
      if (statusCode === API_ERROR_CODES.UNAUTHORIZED) {
        useAuthStore.getState().logout();
      }

      throw new ApiError(message, statusCode, error);
    }
  );

  return client;
};

/**
 * Extrae mensaje de error de la respuesta
 */
const getErrorMessage = (error: AxiosError<{ message?: string }>): string => {
  // Mensaje del servidor
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Errores de red
  if (error.code === 'ECONNABORTED') {
    return 'La solicitud tardó demasiado. Intenta de nuevo.';
  }

  if (!error.response) {
    return 'No se pudo conectar al servidor. Verifica tu conexión.';
  }

  // Mensajes por código de estado
  switch (error.response.status) {
    case 401:
      return 'Sesión expirada. Inicia sesión nuevamente.';
    case 403:
      return 'No tienes permiso para realizar esta acción.';
    case 404:
      return 'Recurso no encontrado.';
    case 422:
      return 'Datos inválidos. Verifica la información.';
    case 500:
      return 'Error del servidor. Intenta más tarde.';
    default:
      return 'Ocurrió un error inesperado.';
  }
};

/**
 * Instancia singleton del cliente HTTP
 */
export const httpClient = createHttpClient();

/**
 * Helper para crear clientes HTTP con configuración custom
 */
export const createCustomHttpClient = (
  customConfig: Partial<typeof apiConfig>
): AxiosInstance => {
  return axios.create({
    ...apiConfig,
    ...customConfig,
  });
};
