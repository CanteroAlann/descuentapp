/**
 * @module infrastructure/query
 * @description Configuración de TanStack Query (React Query).
 * Define el QueryClient con configuración global de cache y errores.
 */
import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../api/http-client';

/**
 * Configuración global del QueryClient
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos"
      staleTime: 5 * 60 * 1000, // 5 minutos
      
      // Tiempo que los datos inactivos se mantienen en cache
      gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
      
      // Número de reintentos automáticos
      retry: (failureCount, error) => {
        // No reintentar errores de autenticación
        if (error instanceof ApiError && error.isUnauthorized) {
          return false;
        }
        // No reintentar errores 404
        if (error instanceof ApiError && error.isNotFound) {
          return false;
        }
        // Máximo 3 reintentos para otros errores
        return failureCount < 3;
      },
      
      // Delay entre reintentos (exponencial)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch en reconexión
      refetchOnReconnect: true,
      
      // Refetch cuando la ventana recupera el foco
      refetchOnWindowFocus: false, // Deshabilitado en mobile
      
      // No ejecutar queries en background
      refetchOnMount: true,
    },
    mutations: {
      // Reintentar mutaciones fallidas una vez
      retry: 1,
      
      // Callback global de error para mutaciones
      onError: (error) => {
        if (__DEV__) {
          console.error('Mutation error:', error);
        }
      },
    },
  },
});

/**
 * Invalida todas las queries de una feature
 * @param featureKey - Key base de la feature (ej: 'discounts')
 */
export const invalidateFeature = async (featureKey: string): Promise<void> => {
  await queryClient.invalidateQueries({ queryKey: [featureKey] });
};

/**
 * Limpia todo el cache (útil para logout)
 */
export const clearQueryCache = (): void => {
  queryClient.clear();
};

/**
 * Prefetch genérico de datos
 */
export const prefetchQuery = async <T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  staleTime?: number
): Promise<void> => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: staleTime ?? 5 * 60 * 1000,
  });
};
